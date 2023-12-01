import dbClient from "../db/connectDb.ts";
import walletHistoryQueries from "../db/queries/walletHistoryQueries.ts";
import { WalletHistorySchema, WalletHistorySchemaCreate } from "../schema/walletHistorySchema.ts";
import { FindResponse, CreateResponse, InfoResponse } from "../schema/utils/responsesSchema.ts";
import userService from "./userService.ts";

const walletHistoryService = {
  findAll: async (): Promise<FindResponse<WalletHistorySchema>> => {
    try {
      const result = await dbClient.query(walletHistoryQueries.findAll);
      return {
        success: true,
        message: "Liste de l'historique du portefeuille récupérée avec succès",
        httpCode: 200,
        data: result as WalletHistorySchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de tout l'historique du portefeuille: ${error.message}`);
    }
  },

  findByUserId: async (userId: number): Promise<FindResponse<WalletHistorySchema>> => {
    try {
      const userExists = await userService.findById(userId);
      if (!userExists.success) {
        return {
          success: false,
          message: userExists.message,
          httpCode: userExists.httpCode,
          data: userExists.data as null
        };
      }

      const walletHistory = await dbClient.query(walletHistoryQueries.findByUserId, [userId]);
      if (walletHistory.length === 0) {
        return {
          success: false,
          message: "Aucun historique du portefeuille pour l'utilisateur",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Historique du portefeuille récupéré avec succès",
        httpCode: 200,
        data: walletHistory as WalletHistorySchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'historique du portefeuille par ID utilisateur: ${error.message}`);
    }
  },

  create: async (data: WalletHistorySchemaCreate): Promise<CreateResponse<InfoResponse>> => {
    try {
      const resultExistUserId = await userService.findById(data.userId);
      if (!resultExistUserId.success) {
        return {
          success: false,
          message: resultExistUserId.message,
          httpCode: resultExistUserId.httpCode,
          info: resultExistUserId.data as null
        };
      }

      const walletHistoryCreate = await dbClient.query(
        walletHistoryQueries.create,
        [data.value, data.operationType, data.userId]
      );
      return {
        success: true,
        message: "Historique du portefeuille créé avec succès",
        httpCode: 201,
        info: walletHistoryCreate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'historique du portefeuille: ${error.message}`);
    }
  },
};

export default walletHistoryService;
