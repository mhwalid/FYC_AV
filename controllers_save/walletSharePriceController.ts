import { Context } from "../deps.ts";
import walletSharePriceService from "../services/walletSharePriceService.ts";
import {
  WalletSharePriceSchemaCreate,
  WalletSharePriceSchemaUpdate,
} from '../schema/walletSharePricesSchema.ts';

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const WalletSharePriceController = {
  async getAllWalletSharePrices(ctx: Context) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const walletSharePrices = await walletSharePriceService.findAll();
      ctx.response.status = walletSharePrices.httpCode;
      ctx.response.body = {
        success: walletSharePrices.success,
        message: walletSharePrices.message,
        walletSharePrices: walletSharePrices.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        walletSharePrices: [],
      };
    }
  },

  async getWalletSharePriceById(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const walletSharePriceId = ctx.params.id;
      const walletSharePrice = await walletSharePriceService.findById(Number(walletSharePriceId));
      ctx.response.status = walletSharePrice.httpCode;
      ctx.response.body = {
        success: walletSharePrice.success,
        message: walletSharePrice.message,
        walletSharePrice: walletSharePrice.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        walletSharePrice: null,
      };
    }
  },

  async createWalletSharePrice(ctx: Context) {
    try {
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const walletSharePriceData: WalletSharePriceSchemaCreate = await ctx.request.body().value;

      const createdWalletSharePrice = await walletSharePriceService.create(walletSharePriceData);
      ctx.response.status = createdWalletSharePrice.httpCode;
      ctx.response.body = {
        success: createdWalletSharePrice.success,
        message: createdWalletSharePrice.message,
        walletSharePrice: createdWalletSharePrice.info,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        walletSharePrice: null,
      };
    }
  },

  async updateWalletSharePriceVolumeById(ctx: Context) {
    try {
      if (ctx.request.method !== 'PUT') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const walletSharePriceVolumeData: WalletSharePriceSchemaUpdate = await ctx.request.body().value;

      const updatedWalletSharePriceVolume = await walletSharePriceService.updateVolumeById(
        walletSharePriceVolumeData
      );
      ctx.response.status = updatedWalletSharePriceVolume.httpCode;
      ctx.response.body = {
        success: updatedWalletSharePriceVolume.success,
        message: updatedWalletSharePriceVolume.message,
        walletSharePrice: updatedWalletSharePriceVolume.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        walletSharePrice: null,
      };
    }
  },

  async deleteWalletSharePriceById(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'DELETE') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const walletSharePriceId = ctx.params.id;
      const deletionResult = await walletSharePriceService.deleteById(Number(walletSharePriceId));
      ctx.response.status = deletionResult.httpCode;
      ctx.response.body = {
        success: deletionResult.success,
        message: deletionResult.message,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
      };
    }
  },

  async findUserSharePrice(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const userId = ctx.params.userId;
      const sharePriceId = ctx.params.sharePriceId;
      const userSharePrice = await walletSharePriceService.findUserSharePrice(
        Number(userId),
        Number(sharePriceId)
      );
      ctx.response.status = userSharePrice.httpCode;
      ctx.response.body = {
        success: userSharePrice.success,
        message: userSharePrice.message,
        userSharePrice: userSharePrice.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        userSharePrice: null,
      };
    }
  },
};

export default WalletSharePriceController;
