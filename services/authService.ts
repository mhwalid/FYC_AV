import { bcrypt, create } from "../deps.ts";
import { key } from "../utils/apiKeys.ts";
import { UserSchemaLogin, UserSchemaCreate } from '../schema/usersSchema.ts'
import userService from "./userService.ts";


interface RegisterResponse {
  success: boolean,
  message: string,
  httpCode: number,
  jwtToken: string | undefined;
}

interface LoginResponse {
  jwtToken: string | undefined;
  success: boolean,
  message: string,
  httpCode: number
}

const AuthentificationService = {
  async register(data: UserSchemaCreate): Promise<RegisterResponse> {
    try {
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const userData = {
        ...data,
        password: hashedPassword,
        cduAcceptedAt: data.isCdu ? new Date() : null, // Assuming isCdu is a boolean
      } as UserSchemaCreate;

      const createUserResponse = await userService.create(userData);

      if (createUserResponse.success) {
        const payload = { foundUserId: createUserResponse.info?.lastInsertId};
        const jwtToken = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);

        return {
          success: true,
          message: "Enregistrement de l'utilisateur effectué avec succès",
          httpCode: 200,
          jwtToken: jwtToken
        };
      } else {
        return {
          success: false,
          message: createUserResponse.message,
          httpCode: 400,
          jwtToken: undefined
        };
      }
    } catch (error) {
      throw new Error(`Error while registering user: ${error.message}`);
    }
  },


  async login(userLogin: UserSchemaLogin): Promise<LoginResponse> {
    try {
      const resultExistUserEmail = await userService.findByEmail(userLogin.email);
      let passwordMatch = false;
      if (resultExistUserEmail.data !== null) {
        passwordMatch = await bcrypt.compare(userLogin.password, resultExistUserEmail.data.password);
      }
     
      if (!resultExistUserEmail.success || !passwordMatch) {
        return {
            success: false,
            message: "Erreur lors de la connexion : Informations invalides",
            httpCode: 400,
            jwtToken: undefined
        }
      }

      const payload = { foundUserId: resultExistUserEmail.data.id };
      const jwtToken = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);

      return {
        success: true,
        message: "Connexion réussi",
        httpCode: 200,
        jwtToken: jwtToken
    }
    } catch (error) {
      throw new Error(`Error while login user: ${error.message}`);
    }
  },
};

export default AuthentificationService;