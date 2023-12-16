import dbClient from "../../db/connectDb.ts";
import sharePriceHistoryQueries from "../../db/queries/sharePrice/sharePriceHistoryQueries.ts";
import { SharePriceHistorySchema, SharePriceHistorySchemaCreate } from "../../schema/sharePrice/sharePriceHistorySchema.ts";
import { FindResponse, CreateResponse, InfoResponse } from "../../schema/utils/responsesSchema.ts";
import sharePriceService from "./sharePriceService.ts";

const sharePriceHistoryService = {
  findAll: async (): Promise<FindResponse<SharePriceHistorySchema>> => {
    try {
      const result = await dbClient.query(sharePriceHistoryQueries.findAll);
      return {
        success: true,
        message: "Liste des historisations d'actions récupérée avec succès",
        httpCode: 200,
        data: result as SharePriceHistorySchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la Liste des historisations d'actionss : ${error.message}`);
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
          message: "Erreur l'historique de cette action n'existe pas",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Historique de l'actions récupéré avec succès",
        httpCode: 200,
        data: sharePriceHistory as SharePriceHistorySchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'historique de l'actions : ${error.message}`);
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
      throw new Error(`Erreur lors de la l'historisation de l'action : ${error.message}`);
    }
  },
};

export default sharePriceHistoryService;
