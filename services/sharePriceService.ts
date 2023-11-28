import dbClient from "../db/connectDb.ts";
import sharePricesQueries from "../db/queries/sharePricesQueries.ts";
import {
  SharePriceSchema,
  SharePriceSchemaCreate,
  SharePriceSchemaUpdate,
} from "../schema/sharePricesSchema.ts";
import {
  FindResponse,
  FindOneResponse,
  DeleteByIdResponse,
  CreateResponse,
  UpdateByIdResponse,
  InfoResponse
} from "../schema/utils/responsesSchema.ts";

const sharePriceService = {
  findAll: async (): Promise<FindResponse<SharePriceSchema>> => {
    try {
      const result = await dbClient.query(sharePricesQueries.findAllSharePrices);
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
      const sharePrice = await dbClient.query(sharePricesQueries.findSharePriceById, [id]);
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
      const existingSharePrice = await dbClient.query(sharePricesQueries.findSharePriceByName, [name]);
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
      
      await dbClient.query(sharePricesQueries.deleteSharePriceById, [id]);
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
        sharePricesQueries.createSharePrice,
        [data.name]
      );
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

  updateById: async (data: SharePriceSchemaUpdate): Promise<UpdateByIdResponse<SharePriceSchema>> => {
    try {
      const resultExistSharePriceName = await sharePriceService.checkIfNameNotExists(data.name)
      if (!resultExistSharePriceName.success) {
        return {
          success: false,
          message: resultExistSharePriceName.message,
          httpCode: resultExistSharePriceName.httpCode,
          data: resultExistSharePriceName.data as SharePriceSchema
        }
      }

      const resultExistSharePriceId = await sharePriceService.findById(data.id)
      if (!resultExistSharePriceId.success) {
        return {
          success: false,
          message: resultExistSharePriceId.message,
          httpCode: resultExistSharePriceId.httpCode,
          data: resultExistSharePriceId.data as null
        }
      }

      const sharePriceUpdate = await dbClient.query(
        sharePricesQueries.updateSharePriceById,
        [data.name, data.id]
      );
      return {
        success: true,
        message: "Prix d'actions mis à jour avec succès",
        httpCode: 200,
        data: sharePriceUpdate as SharePriceSchema,
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

export default sharePriceService;