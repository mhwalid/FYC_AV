import dbClient from "../db/connectDb.ts";
import sharePricesQueries from "../db/queries/sharePricesQueries.ts";
import {
  SharePriceSchema,
  SharePriceSchemaCreate,
  SharePriceSchemaUpdate,
  UpdateByIdSharePriceResponse
} from "../schema/sharePricesSchema.ts";
import {
  FindResponse,
  FindOneResponse,
  DeleteByIdResponse,
  CreateResponse,
  InfoResponse
} from "../schema/utils/responsesSchema.ts";
import { SharePriceHistorySchemaCreate } from "../schema/sharePriceHistorySchema.ts";
import sharePriceHistoryService from "./sharePriceHistoryService.ts";

const sharePriceService = {
  findAll: async (): Promise<FindResponse<SharePriceSchema>> => {
    try {
      const result = await dbClient.query(sharePricesQueries.findAll);
      return {
        success: true,
        message: "Liste des prix d'actions récupérée avec succès",
        httpCode: 200,
        data: result as SharePriceSchema[],
      };
    } catch (error) {
      throw new Error(`Error while fetching all share prices: ${error.message}`);
    }
  },

  findById: async (id: number): Promise<FindOneResponse<SharePriceSchema>> => {
    try {
      const sharePrice = await dbClient.query(sharePricesQueries.findById, [id]);
      if (sharePrice.length === 0) {
        return {
          success: false,
          message: "Le prix d'actions n'existe pas",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Prix d'actions récupéré avec succès",
        httpCode: 200,
        data: sharePrice[0] as SharePriceSchema,
      };
    } catch (error) {
      throw new Error(`Error while fetching share price by Id: ${error.message}`);
    }
  },

  checkIfNameNotExists: async (name: string): Promise<FindOneResponse<SharePriceSchema>> => {
    try {
      const existingSharePrice = await dbClient.query(sharePricesQueries.findByName, [name]);
      if (existingSharePrice.length > 0) {
        return {
          success: false,
          message: "Le prix d'actions existe déjà",
          httpCode: 409,
          data: existingSharePrice[0] as SharePriceSchema,
        };
      }
      return {
        success: true,
        message: "Le prix d'actions n'existe pas",
        httpCode: 404,
        data: null,
      };
    } catch (error) {
      throw new Error(`Error while checking share price name existence: ${error.message}`);
    }
  },

  deleteById: async (id: number): Promise<DeleteByIdResponse> => {
    try {
      const resultExistSharePriceId = await sharePriceService.findById(id);
      if (!resultExistSharePriceId.success) {
        return {
          success: false,
          message: resultExistSharePriceId.message,
          httpCode: resultExistSharePriceId.httpCode,
        };
      }

      const isSharePriceInUse = await sharePriceService.isSharePriceInUse(id);
      if (isSharePriceInUse) {
        return {
          success: false,
          message: "Erreur lors de la suppression du prix d'actions. Il est utilisé par au moins une transaction",
          httpCode: 400,
        };
      }

      await dbClient.query(sharePricesQueries.delete, [id]);
      return {
        success: true,
        message: "Le prix d'actions a été supprimé avec succès",
        httpCode: 200,
      };
    } catch (error) {
      throw new Error(`Error while deleting share price by Id: ${error.message}`);
    }
  },

  create: async (data: SharePriceSchemaCreate): Promise<CreateResponse<SharePriceSchema>> => {
    try {
      const resultExistSharePriceName = await sharePriceService.checkIfNameNotExists(data.name)
      if (!resultExistSharePriceName.success) {
        return {
          success: false,
          message: resultExistSharePriceName.message,
          httpCode: resultExistSharePriceName.httpCode,
          info: resultExistSharePriceName.data as SharePriceSchema
        }
      }

      const sharePriceCreate = await dbClient.execute(
        sharePricesQueries.create,
        [data.name, data.value, data.volume]
      );

      // On historise l'action
      if (sharePriceCreate.lastInsertId !== undefined) {
        const sharePriceHistory: SharePriceHistorySchemaCreate = {
          oldValue: data.value,
          oldVolume: data.volume,
          sharePriceId: sharePriceCreate.lastInsertId
        }
        await sharePriceHistoryService.create(sharePriceHistory);
      }

      return {
        success: true,
        message: "Prix d'actions créé avec succès",
        httpCode: 201,
        info: sharePriceCreate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Error while creating share price: ${error.message}`);
    }
  },

  updateById: async (data: SharePriceSchemaUpdate): Promise<UpdateByIdSharePriceResponse> => {
    try {
      const resultExistSharePriceId = await sharePriceService.findById(data.id)
      if (!resultExistSharePriceId.success) {
        return {
          success: false,
          message: resultExistSharePriceId.message,
          httpCode: resultExistSharePriceId.httpCode,
          data: resultExistSharePriceId.data as null,
          sharePriceHistoryId: null
        }
      }

      if (data.name != undefined) {
        const resultExistSharePriceName = await sharePriceService.checkIfNameNotExists(data.name)
        if (!resultExistSharePriceName.success) {
          return {
            success: false,
            message: resultExistSharePriceName.message,
            httpCode: resultExistSharePriceName.httpCode,
            data: resultExistSharePriceName.data as SharePriceSchema,
            sharePriceHistoryId: null
          }
        }
      }

      const updateParams = buildUpdateParams(data);
      const updateString = buildUpdateString(data);

      const query = sharePricesQueries.update.replace(`{updateString}`, updateString);
      const sharePriceUpdate = await dbClient.query(query, updateParams);


      // On récupére les nouvelles valeurs de l'action
      const sharePrice = await sharePriceService.findById(sharePriceUpdate.lastInsertId)
      if (!sharePrice.success || sharePrice.data === null) {
        return {
          success: false,
          message: resultExistSharePriceId.message,
          httpCode: resultExistSharePriceId.httpCode,
          data: resultExistSharePriceId.data as null,
          sharePriceHistoryId: null
        }
      }

      // On historise les nouvelles valeurs de l'action
      const sharePriceHistory: SharePriceHistorySchemaCreate = {
        oldValue: sharePrice.data.value,
        oldVolume: sharePrice.data.volume,
        sharePriceId: sharePriceUpdate.lastInsertId
      }
      const sharePriceHistoryResponse = await sharePriceHistoryService.create(sharePriceHistory);
      if (sharePriceHistoryResponse.info === null) {
        return {
          success: false,
          message: "Historisation de l'action impossible",
          httpCode: 500,
          data: null,
          sharePriceHistoryId: null
        }
      }

      return {
        success: true,
        message: "Prix d'actions mis à jour avec succès",
        httpCode: 200,
        data: sharePriceUpdate as SharePriceSchema,
        sharePriceHistoryId: sharePriceHistoryResponse.info.lastInsertId
      };
    } catch (error) {
      throw new Error(`Error while updating share price by Id: ${error.message}`);
    }
  },

  // Ajout de la méthode pour vérifier si le prix d'actions est utilisé dans une transaction
  isSharePriceInUse: async (id: number): Promise<boolean> => {
    try {
      const result = await dbClient.query(sharePricesQueries.checkSharePriceInTransactionUsage, [id]);
      return result[0].count > 0;
    } catch (error) {
      throw new Error(`Error while checking if share price is in use: ${error.message}`);
    }
  },
};

const buildUpdateParams = (data: SharePriceSchemaUpdate): any[] => {
  const updateParams: any[] = [];
  if (data.name) {
    updateParams.push(data.name);
  }
  if (data.value) {
    updateParams.push(data.value);
  }
  if (data.volume) {
    updateParams.push(data.volume);
  }

  updateParams.push(data.id)
  return updateParams;
};

const buildUpdateString = (data: SharePriceSchemaUpdate): string => {
  const updates: string[] = [];
  if (data.name) {
    updates.push(`name = ?`);
  }
  if (data.value) {
    updates.push(`value = ?`);
  }
  if (data.volume) {
    updates.push(`volume = ?`);
  }
  return updates.join(", ");
};

export default sharePriceService;