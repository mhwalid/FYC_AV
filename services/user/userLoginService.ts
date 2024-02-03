import dbClient from "../../db/connectDb.ts";
import userLoginQueries from "../../db/queries/user/userLoginQueries.ts";
import {
  UserLoginSchema,
  UserLoginSchemaCreate,
} from "../../schema/user/userLoginsSchema.ts";
import {
  CreateResponse,
  FindResponse,
  InfoResponse,
} from "../../schema/utils/responsesSchema.ts";
import userService from "./userService.ts";

const userLoginService = {
  findAll: async (): Promise<FindResponse<UserLoginSchema>> => {
    try {
      const result = await dbClient.query(userLoginQueries.findAll);
      return {
        success: true,
        message: "Liste des connexions utilisateur récupérée avec succès",
        httpCode: 200,
        data: result as UserLoginSchema[],
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de toutes les connexions utilisateur : ${error.message}`,
      );
    }
  },

  findByUserId: async (
    userId: number,
  ): Promise<FindResponse<UserLoginSchema>> => {
    try {
      const userExists = await userService.findById(userId);
      if (!userExists.success) {
        return {
          success: false,
          message: userExists.message,
          httpCode: userExists.httpCode,
          data: userExists.data as null,
        };
      }

      const userLogin = await dbClient.query(userLoginQueries.findByUserId, [
        userId,
      ]);
      if (userLogin.length === 0) {
        return {
          success: false,
          message: "Erreur il n'existe pas de connexion pour cette utilisateur",
          httpCode: 404,
          data: userLogin as null,
        };
      }
      return {
        success: true,
        message: "Connexions de l'utilisateur récupérées avec succès",
        httpCode: 200,
        data: userLogin as UserLoginSchema[],
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des connexions de l'utilisateur : ${error.message}`,
      );
    }
  },

  create: async (
    data: UserLoginSchemaCreate,
  ): Promise<CreateResponse<InfoResponse>> => {
    try {
      const userLoginCreate = await dbClient.query(userLoginQueries.create, [
        data.userId,
      ]);
      return {
        success: true,
        message: "Connexion utilisateur créée avec succès",
        httpCode: 201,
        info: userLoginCreate as InfoResponse,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la création de la connexion utilisateur : ${error.message}`,
      );
    }
  },
};

export default userLoginService;
