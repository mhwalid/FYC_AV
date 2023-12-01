import { Context } from "../deps.ts";
import walletHistoryService from "../services/walletHistoryService.ts";
import { WalletHistorySchemaCreate } from '../schema/walletHistorySchema.ts';

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const WalletHistoryController = {
  async getAllWalletHistory(ctx: Context) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const walletHistory = await walletHistoryService.findAll();
      ctx.response.status = walletHistory.httpCode;
      ctx.response.body = {
        success: walletHistory.success,
        message: walletHistory.message,
        walletHistory: walletHistory.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        walletHistory: [],
      };
    }
  },

  async getWalletHistoryByUserId(ctx: CustomContext) {
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
      const userWalletHistory = await walletHistoryService.findByUserId(Number(userId));
      ctx.response.status = userWalletHistory.httpCode;
      ctx.response.body = {
        success: userWalletHistory.success,
        message: userWalletHistory.message,
        userWalletHistory: userWalletHistory.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        userWalletHistory: null,
      };
    }
  },

  async createWalletHistory(ctx: Context) {
    try {
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const walletHistoryData: WalletHistorySchemaCreate = await ctx.request.body().value;

      const createdWalletHistory = await walletHistoryService.create(walletHistoryData);
      ctx.response.status = createdWalletHistory.httpCode;
      ctx.response.body = {
        success: createdWalletHistory.success,
        message: createdWalletHistory.message,
        walletHistory: createdWalletHistory.info,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        walletHistory: null,
      };
    }
  },
};

export default WalletHistoryController;
