import { bcrypt, create, validate } from "../../deps.ts";
import { getKey } from "../../utils/keyManager.ts";

import { UserLoginSchemaCreate } from "../../schema/user/userLoginsSchema.ts";
import { UserSchemaRegister, UserSchemaLogin } from '../../schema/user/usersSchema.ts';
import userService from "../user/userService.ts";
import userLoginService from "../user/userLoginService.ts";
import { LoginResponse, RegisterResponse } from "../../schema/auth/authSchema.ts";
import { Payload } from "https://deno.land/x/djwt@v2.9.1/mod.ts";
import roleService from "../user/roleService.ts";

const JWT_TOKEN_EXPIRATION_MINUTES = 5

const AuthentificationService = {
  async register(data: UserSchemaRegister): Promise<RegisterResponse> {
    try {
      const errors = await validate(new UserSchemaRegister(data));

      if (errors.length > 0) {
        return {
          success: false,
          message: "Les données fournies ne sont pas valides",
          httpCode: 422,
          errors: errors
        }
      }

      const createUserResponse = await userService.register(data);

      if (createUserResponse.success) {
        const jwtToken = await createJwtToken();

        // Récupération du role de l'utilisateur
        if (createUserResponse.info !== null) {
          const roleResponse = await roleService.findByUserId(createUserResponse.info?.lastInsertId)
          if (!roleResponse.success || roleResponse.data === null) {
            return {
              success: roleResponse.success,
              message: roleResponse.message,
              httpCode: roleResponse.httpCode
            }
          }

          return {
            success: true,
            message: "Enregistrement de l'utilisateur effectué avec succès",
            httpCode: 200,
            jwtToken: jwtToken,
            userId: createUserResponse.info?.lastInsertId,
            roleName: roleResponse.data.name
          };
        }
      } else {
        return {
          success: false,
          message: createUserResponse.message,
          httpCode: 400
        };
      }
    } catch (error) {
      throw new Error(`Erreur lors de l'enregistrement de l'utilisateur :  ${error.message}`);
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
          message: "Erreur lors de la connexion : Informations de connexion invalides",
          httpCode: 400
        }
      }

      // Récupération du role de l'utilisateur
      if (resultExistUserEmail.data !== null) {
        const roleResponse = await roleService.findByUserId(resultExistUserEmail.data.id)
        if (!roleResponse.success || roleResponse.data === null) {
          return {
            success: roleResponse.success,
            message: roleResponse.message,
            httpCode: roleResponse.httpCode
          }
        }

        const jwtToken = await createJwtToken();

        // Ajoute la connexion de l'utilisateur à notre table de suivi des connexions
        const userLoginCreate: UserLoginSchemaCreate = {
          userId: resultExistUserEmail.data.id
        }
        await userLoginService.create(userLoginCreate);

        return {
          success: true,
          message: "Connexion réussi",
          httpCode: 200,
          jwtToken: jwtToken,
          userId: resultExistUserEmail.data.id,
          roleName: roleResponse.data.name
        }

      }
      return {
        success: false,
        message: "Erreur aucun utilisateur trouvé",
        httpCode: 404
      }
    } catch (error) {
      throw new Error(`Erreur lors de la connexion de l'utilisateur : ${error.message}`);
    }
  },
};

async function createJwtToken(): Promise<string> {
  const payload: Payload = {
    exp: Math.floor(Date.now() / 1000) + (JWT_TOKEN_EXPIRATION_MINUTES * 60), // Temps d'expiration UNIX
  };

  const jwtToken = await create({ alg: "HS512", typ: "JWT" }, payload, await getKey());
  return jwtToken;
}

export default AuthentificationService;