import dbClient from "../../db/connectDb.ts";
import sharePricesQueries from "../../db/queries/sharePrice/sharePricesQueries.ts";
import {
  SharePriceSchema,
  SharePriceSchemaCreate,
  SharePriceSchemaUpdate,
  UpdateByIdSharePriceResponse,
} from "../../schema/sharePrice/sharePricesSchema.ts";
import {
  CreateResponse,
  FindOneResponse,
  FindResponse,
  InfoResponse,
} from "../../schema/utils/responsesSchema.ts";
import { SharePriceHistorySchemaCreate } from "../../schema/sharePrice/sharePriceHistorySchema.ts";
import sharePriceHistoryService from "./sharePriceHistoryService.ts";

const sharePriceService = {
  findAll: async (): Promise<FindResponse<SharePriceSchema>> => {
    try {
      const result = await dbClient.query(sharePricesQueries.findAll);
      return {
        success: true,
        message: "Liste des actions récupérée avec succès",
        httpCode: 200,
        data: result as SharePriceSchema[],
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des actions : ${error.message}`,
      );
    }
  },

  findById: async (id: number): Promise<FindOneResponse<SharePriceSchema>> => {
    try {
      const sharePrice = await dbClient.query(sharePricesQueries.findById, [
        id,
      ]);

      if (sharePrice.length === 0) {
        return {
          success: false,
          message: "Erreur l'action n'existe pas",
          httpCode: 404,
          data: null,
        };
      }

      return {
        success: true,
        message: "Action récupérée avec succès",
        httpCode: 200,
        data: sharePrice[0] as SharePriceSchema,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'action : ${error.message}`,
      );
    }
  },

  checkIfNameNotExists: async (
    name: string,
  ): Promise<FindOneResponse<SharePriceSchema>> => {
    try {
      const existingSharePrice = await dbClient.query(
        sharePricesQueries.findByName,
        [name],
      );
      if (existingSharePrice.length > 0) {
        return {
          success: false,
          message: "Erreur une action avec ce nom existe déjà",
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
      throw new Error(
        `Erreur lors de la vérification de l'existence d"une action par son nom : ${error.message}`,
      );
    }
  },

  create: async (
    data: SharePriceSchemaCreate,
  ): Promise<CreateResponse<SharePriceSchema>> => {
    try {
      const resultExistSharePriceName = await sharePriceService
        .checkIfNameNotExists(data.name);
      if (!resultExistSharePriceName.success) {
        return {
          success: false,
          message: resultExistSharePriceName.message,
          httpCode: resultExistSharePriceName.httpCode,
          info: resultExistSharePriceName.data as SharePriceSchema,
        };
      }

      const sharePriceCreate = await dbClient.execute(
        sharePricesQueries.create,
        [data.name, data.value, data.volume],
      );

      // On historise l'action
      if (sharePriceCreate.lastInsertId !== undefined) {
        const sharePriceHistory: SharePriceHistorySchemaCreate = {
          oldValue: data.value,
          oldVolume: data.volume,
          sharePriceId: sharePriceCreate.lastInsertId,
        };
        await sharePriceHistoryService.create(sharePriceHistory);
      }

      return {
        success: true,
        message: "Action créée avec succès",
        httpCode: 201,
        info: sharePriceCreate as InfoResponse,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la création de l'action : ${error.message}`,
      );
    }
  },

  updateById: async (
    data: SharePriceSchemaUpdate,
  ): Promise<UpdateByIdSharePriceResponse> => {
    try {
      const resultExistSharePriceId = await sharePriceService.findById(data.id);
      if (!resultExistSharePriceId.success) {
        return {
          success: false,
          message: resultExistSharePriceId.message,
          httpCode: resultExistSharePriceId.httpCode,
          data: resultExistSharePriceId.data as null,
          sharePriceHistoryId: null,
        };
      }

      if (data.name != undefined) {
        const resultExistSharePriceName = await sharePriceService
          .checkIfNameNotExists(data.name);
        if (resultExistSharePriceName.success) {
          return {
            success: false,
            message: resultExistSharePriceName.message,
            httpCode: resultExistSharePriceName.httpCode,
            data: resultExistSharePriceName.data as SharePriceSchema,
            sharePriceHistoryId: null,
          };
        }
      }

      const updateParams = buildUpdateParams(data);
      const updateString = buildUpdateString(data);

      const query = sharePricesQueries.update.replace(
        `{updateString}`,
        updateString,
      );
      const sharePriceUpdate = await dbClient.query(query, updateParams);

      const sharePrice = await sharePriceService.findById(data.id);

      if (!sharePrice.success || sharePrice.data === null) {
        return {
          success: false,
          message: resultExistSharePriceId.message,
          httpCode: resultExistSharePriceId.httpCode,
          data: resultExistSharePriceId.data as null,
          sharePriceHistoryId: null,
        };
      }

      // On historise les nouvelles valeurs de l'action
      const sharePriceHistory: SharePriceHistorySchemaCreate = {
        oldValue: sharePrice.data.value,
        oldVolume: sharePrice.data.volume,
        sharePriceId: data.id,
      };
      const sharePriceHistoryResponse = await sharePriceHistoryService.create(
        sharePriceHistory,
      );
      if (sharePriceHistoryResponse.info === null) {
        return {
          success: false,
          message: "Erreur historisation de l'action impossible",
          httpCode: 500,
          data: null,
          sharePriceHistoryId: null,
        };
      }

      return {
        success: true,
        message: "Actions mis à jour avec succès",
        httpCode: 200,
        data: sharePriceUpdate as SharePriceSchema,
        sharePriceHistoryId: sharePriceHistoryResponse.info.lastInsertId,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour de l'action : ${error.message}`,
      );
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

  updateParams.push(data.id);
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
