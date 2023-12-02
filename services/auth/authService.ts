import { bcrypt, create, verify } from "../../deps.ts";
import { key } from "../../utils/apiKeys.ts";

import { UserLoginSchemaCreate } from "../../schema/user/userLoginsSchema.ts";
import { UserSchemaCreate, UserSchemaLogin } from '../../schema/user/usersSchema.ts';
import userService from "../user/userService.ts";
import userLoginService from "../user/userLoginService.ts";
import { LoginResponse, RegisterResponse, LogoutResponse } from "../../schema/auth/authSchema.ts";

const JWT_TOKEN_EXPIRATION_MINUTES = 5

const AuthentificationService = {
  async register(data: UserSchemaCreate): Promise<RegisterResponse> {
    try {
      const createUserResponse = await userService.create(userData);

      if (createUserResponse.success) {
        const jwtToken = await createJwtToken(createUserResponse.info?.lastInsertId, JWT_TOKEN_EXPIRATION_MINUTES);
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
          message: "Erreur lors de la connexion : Informations invalides",
          httpCode: 400,
          jwtToken: undefined,
          userId: undefined
        }
      }

      if (resultExistUserEmail.data !== null) {
        const jwtToken = await createJwtToken(resultExistUserEmail.data.id, JWT_TOKEN_EXPIRATION_MINUTES);

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
          userId: resultExistUserEmail.data.id
        }

      }
      return {
        success: false,
        message: "Erreur aucun utilisateur trouvé",
        httpCode: 404,
        jwtToken: undefined,
        userId: undefined
      }
    } catch (error) {
      throw new Error(`Erreur lors de la connexion de l'utilisateur : ${error.message}`);
    }
  },

  logout(token: string): LogoutResponse {
    try {

      disableJwtToken(token);

      return {
        success: true,
        message: "Deconnexion réussi",
        httpCode: 200,
      }
    } catch (error) {
      throw new Error(`Error during logout: ${error.message}`);
    }
  }
};

async function createJwtToken(userId: number, expiresInMinutes: number): Promise<string> {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + (expiresInMinutes * 60), // Temps d'expiration UNIX
    foundUserId: userId
  };
  const jwtToken = await create({ alg: "HS512", typ: "JWT" }, payload, key);
  return jwtToken;
}

async function disableJwtToken(jwtToken: string) {
  const jwtPayload = await verify(jwtToken, key);
  // Faire expiré le token
  const actualTimeStampUnix = Math.floor(Date.now() / 1000)
  jwtPayload.exp = actualTimeStampUnix

  return jwtPayload;
}

export default AuthentificationService;