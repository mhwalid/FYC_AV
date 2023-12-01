import dbClient from "../db/connectDb.ts";
import sharePriceHistoryQueries from "../db/queries/sharePriceHistoryQueries.ts";
import { SharePriceHistorySchema, SharePriceHistorySchemaCreate } from "../schema/sharePriceHistorySchema.ts";
import { FindResponse, FindOneResponse, CreateResponse, InfoResponse } from "../schema/utils/responsesSchema.ts";
import sharePriceService from "./sharePriceService.ts";

const sharePriceHistoryService = {
  findAll: async (): Promise<FindResponse<SharePriceHistorySchema>> => {
    try {
      const result = await dbClient.query(sharePriceHistoryQueries.findAll);
      return {
        success: true,
        message: "Liste de l'historique des prix d'actions récupérée avec succès",
        httpCode: 200,
        data: result as SharePriceHistorySchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de tout l'historique des prix d'actions: ${error.message}`);
    }
  },

  findById: async (sharePriceHistoryId: number): Promise<FindOneResponse<SharePriceHistorySchema>> => {
    try {
      const sharePriceHistory = await dbClient.query(sharePriceHistoryQueries.findById, [sharePriceHistoryId]);
      if (sharePriceHistory.length === 0) {
        return {
          success: false,
          message: "Historique des prix d'actions n'existe pas",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Historique des prix d'actions récupéré avec succès",
        httpCode: 200,
        data: sharePriceHistory as SharePriceHistorySchema,
      };

    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'historique des prix d'actions : ${error.message}`);
    }
  },

  findBySharePriceId: async (sharePriceId: number): Promise<FindResponse<SharePriceHistorySchema>> => {
    try {
      const sharePriceExists = await sharePriceService.findById(sharePriceId);
      if (!sharePriceExists.success) {
        return {
          success: false,
          message: sharePriceExists.message,
          httpCode: sharePriceExists.httpCode,
          data: sharePriceExists.data as null
        };
      }

      const sharePriceHistory = await dbClient.query(sharePriceHistoryQueries.findBySharePriceId, [sharePriceId]);
      if (sharePriceHistory.length === 0) {
        return {
          success: false,
          message: "L'historique de ce prix d'action n'existe pas",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Historique du prix d'actions récupéré avec succès",
        httpCode: 200,
        data: sharePriceHistory as SharePriceHistorySchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'historique du prix d'actions par ID de prix d'actions: ${error.message}`);
    }
  },

  create: async (data: SharePriceHistorySchemaCreate): Promise<CreateResponse<InfoResponse>> => {
    try {
      const sharePriceHistoryCreate = await dbClient.query(sharePriceHistoryQueries.create, [data.oldValue, data.oldVolume, data.sharePriceId]);
      return {
        success: true,
        message: "Historique des prix d'actions créé avec succès",
        httpCode: 201,
        info: sharePriceHistoryCreate as InfoResponse
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'historique des prix d'actions: ${error.message}`);
    }
  },
};

export default sharePriceHistoryService;
