import { bcrypt, create, verify, getNumericDate } from "../deps.ts";
import { key } from "../utils/apiKeys.ts";
import { UserSchemaLogin, UserSchemaCreate } from '../schema/usersSchema.ts'
import userService from "./userService.ts";
import { UserLoginSchemaCreate } from "../schema/userLoginsSchema.ts";
import userLoginService from "./userLoginService.ts";


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
  httpCode: number,
  userId: number | undefined
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
        return {
          success: true,
          message: "Enregistrement de l'utilisateur effectué avec succès",
          httpCode: 200,
          jwtToken: await AuthentificationService.generateJWTToken(createUserResponse.info?.lastInsertId)
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
          jwtToken: undefined,
          userId: undefined
        }
      }

      if (resultExistUserEmail.data !== null) {
        // Ajoute la connexion de l'utilisateur à notre table de suivi des connexions
        const userLogin: UserLoginSchemaCreate = {
          userId: resultExistUserEmail.data.id
        }
        await userLoginService.create(userLogin);

        return {
          success: true,
          message: "Connexion réussi",
          httpCode: 200,
          jwtToken: await AuthentificationService.generateJWTToken(resultExistUserEmail.data.id),
          userId: resultExistUserEmail.data.id
        }
      }
      return {
        success: false,
        message: "Aucun utilisateur trouvé",
        httpCode: 404,
        jwtToken: undefined,
        userId: undefined
      }
    } catch (error) {
      throw new Error(`Error while login user: ${error.message}`);
    }
  },

  async generateJWTToken(userId: number): Promise<string> {
    const payload = {
      userId: userId,
      exp: getNumericDate(60 * 60 * 24), // Expiration dans 24 heures
    };

    const jwtToken = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
    return jwtToken;
  },

  async verifyJWTToken(token: string): Promise<any | null> {
    try {
      const verifiedToken = await verify(token, key);
      return verifiedToken;
    } catch (error) {
      return null;
    }
  },
};

export default AuthentificationService;