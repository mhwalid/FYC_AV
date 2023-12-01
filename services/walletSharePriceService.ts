import dbClient from "../db/connectDb.ts";
import walletSharePriceQueries from "../db/queries/walletSharePriceQueries.ts";
import { WalletSharePriceSchema, WalletSharePriceSchemaCreate, WalletSharePriceSchemaUpdate } from "../schema/walletSharePricesSchema.ts";
import { FindResponse, CreateResponse, UpdateByIdResponse, DeleteByIdResponse, FindOneResponse } from "../schema/utils/responsesSchema.ts";
import { InfoResponse } from "../schema/utils/responsesSchema.ts";
import userService from "./userService.ts";
import sharePriceService from "./sharePriceService.ts";

const walletSharePriceService = {
  findAll: async (): Promise<FindResponse<WalletSharePriceSchema>> => {
    try {
      const result = await dbClient.query(walletSharePriceQueries.findAll);
      return {
        success: true,
        message: "Liste des transactions de partage récupérée avec succès",
        httpCode: 200,
        data: result as WalletSharePriceSchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de toutes les transactions de partage : ${error.message}`);
    }
  },

  findById: async (walletSharePriceId: number): Promise<FindOneResponse<WalletSharePriceSchema>> => {
    try {
      const walletSharePrice = await dbClient.query(walletSharePriceQueries.findById, [walletSharePriceId]);
      if (walletSharePrice.length === 0) {
        return {
          success: false,
          message: "La transaction de partage de l'utilisateur n'existe pas",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Transaction de partage de l'utilisateur récupéré avec succès",
        httpCode: 200,
        data: walletSharePrice as WalletSharePriceSchema,
      };

    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'historique des prix d'actions : ${error.message}`);
    }
  },

  findByUserId: async (userId: number): Promise<FindResponse<WalletSharePriceSchema>> => {
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

      const walletSharePrice = await dbClient.query(walletSharePriceQueries.findByUserId, [userId]);
      if (walletSharePrice.length === 0) {
        return {
          success: false,
          message: "L'utilisateur n'a pas d'action dans son portefeuille",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Portefeuille d'action de l'utilisateur récupéré avec succès",
        httpCode: 200,
        data: walletSharePrice as WalletSharePriceSchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des transactions de partage par ID utilisateur : ${error.message}`);
    }
  },

  create: async (data: WalletSharePriceSchemaCreate): Promise<CreateResponse<InfoResponse>> => {
    try {
      const walletSharePriceCreate = await dbClient.query(
        walletSharePriceQueries.create,
        [data.volume, data.sharePriceId, data.userId]
      );
      return {
        success: true,
        message: "Transaction de partage créée avec succès",
        httpCode: 201,
        info: walletSharePriceCreate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de la transaction de partage : ${error.message}`);
    }
  },

  updateVolumeById: async (data: WalletSharePriceSchemaUpdate): Promise<UpdateByIdResponse<WalletSharePriceSchema>> => {
    try {
      const resultExistWalletSharePriceId = await walletSharePriceService.findById(data.id)
      if (!resultExistWalletSharePriceId.success) {
        return {
          success: false,
          message: resultExistWalletSharePriceId.message,
          httpCode: resultExistWalletSharePriceId.httpCode,
          data: resultExistWalletSharePriceId.data as null
        }
      }

      const result = await dbClient.query(walletSharePriceQueries.updateVolume, [data.volume, data.id]);
      return {
        success: true,
        message: "Volume de transaction de partage mis à jour avec succès",
        httpCode: 200,
        data: result as WalletSharePriceSchema,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du volume de transaction de partage par ID : ${error.message}`);
    }
  },

  deleteById: async (id: number): Promise<DeleteByIdResponse> => {
    try {
      const resultExistWalletSharePriceId = await walletSharePriceService.findById(id)
      if (!resultExistWalletSharePriceId.success) {
        return {
          success: false,
          message: resultExistWalletSharePriceId.message,
          httpCode: resultExistWalletSharePriceId.httpCode
        }
      }

      await dbClient.query(walletSharePriceQueries.delete, [id]);
      return {
        success: true,
        message: "Transaction de partage supprimée avec succès",
        httpCode: 200,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la transaction de partage par ID : ${error.message}`);
    }
  },

  findUserSharePrice: async (userId: number, sharePriceId: number): Promise<FindOneResponse<WalletSharePriceSchema>> => {
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

      const sharePriceExists = await sharePriceService.findById(sharePriceId);
      if (!sharePriceExists.success) {
        return {
          success: false,
          message: sharePriceExists.message,
          httpCode: sharePriceExists.httpCode,
          data: sharePriceExists.data as null
        };
      }

      const result = await dbClient.query(walletSharePriceQueries.findUserSharePrice, [userId, sharePriceId]);
      return {
        success: true,
        message: "Transactions de partage de l'utilisateur pour ce prix récupérées avec succès",
        httpCode: 200,
        data: result as WalletSharePriceSchema,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des transactions de partage par ID utilisateur et ID de prix : ${error.message}`);
    }
  },
};

export default walletSharePriceService;
