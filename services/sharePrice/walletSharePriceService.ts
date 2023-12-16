import dbClient from "../../db/connectDb.ts";
import walletSharePriceQueries from "../../db/queries/sharePrice/walletSharePriceQueries.ts";
import { WalletSharePriceSchema, WalletSharePriceSchemaCreate, WalletSharePriceSchemaUpdate } from "../../schema/sharePrice/walletSharePricesSchema.ts";
import { FindResponse, CreateResponse, UpdateByIdResponse, FindOneResponse } from "../../schema/utils/responsesSchema.ts";
import { InfoResponse } from "../../schema/utils/responsesSchema.ts";
import userService from "../user/userService.ts";
import sharePriceService from "./sharePriceService.ts";

const walletSharePriceService = {
  findById: async (walletSharePriceId: number): Promise<FindOneResponse<WalletSharePriceSchema>> => {
    try {
      const walletSharePrice = await dbClient.query(walletSharePriceQueries.findById, [walletSharePriceId]);
      if (walletSharePrice.length === 0) {
        return {
          success: false,
          message: "Erreur l'utilisateur ne possède pas d'action",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Action possédè récupéré avec succès",
        httpCode: 200,
        data: walletSharePrice as WalletSharePriceSchema,
      };

    } catch (error) {
      throw new Error(`Erreur lors de la récupération du portefeuille de l'action : ${error.message}`);
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
          message: "Erreur l'utilisateur n'a pas d'action dans son portefeuille",
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
      throw new Error(`Erreur lors de la récupération du portefeuille des actions de l'utilisateur : ${error.message}`);
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
        message: "Action ajouté avec succès au portefeuille",
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
        message: "Volume d'action dans le portefeuille mis à jour avec succès",
        httpCode: 200,
        data: result as WalletSharePriceSchema,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du volume d'action dans le portefeuille : ${error.message}`);
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
          data: null
        };
      }

      const sharePriceExists = await sharePriceService.findById(sharePriceId);
      if (!sharePriceExists.success) {
        return {
          success: false,
          message: sharePriceExists.message,
          httpCode: sharePriceExists.httpCode,
          data: null
        };
      }

      const result = await dbClient.query(walletSharePriceQueries.findUserSharePrice, [userId, sharePriceId]);

      if (result.length === 0) {
        return {
          success: false,
          message: "Erreur aucun wallet pour cette action possèdé par l'utilisateur",
          httpCode: 404,
          data: null
        };
      }
      return {
        success: true,
        message: "Portefeuille de l'action de l'utilisateur récupéré avec succès",
        httpCode: 200,
        data: result[0] as WalletSharePriceSchema,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du portefeuille d'action de l'utilisateur : ${error.message}`);
    }
  },
};

export default walletSharePriceService;
