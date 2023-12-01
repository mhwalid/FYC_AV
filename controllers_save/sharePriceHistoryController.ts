import { Context } from "../deps.ts";
import sharePriceHistoryService from "../services/sharePriceHistoryService.ts";
import { SharePriceHistorySchemaCreate } from '../schema/sharePriceHistorySchema.ts';

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const SharePriceHistoryController = {
  async getAllSharePriceHistory(ctx: Context) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const sharePriceHistory = await sharePriceHistoryService.findAll();
      ctx.response.status = sharePriceHistory.httpCode;
      ctx.response.body = {
        success: sharePriceHistory.success,
        message: sharePriceHistory.message,
        sharePriceHistory: sharePriceHistory.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        sharePriceHistory: [],
      };
    }
  },

  async getSharePriceHistoryById(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const sharePriceHistoryId = ctx.params.id;
      const sharePriceHistory = await sharePriceHistoryService.findById(Number(sharePriceHistoryId));
      ctx.response.status = sharePriceHistory.httpCode;
      ctx.response.body = {
        success: sharePriceHistory.success,
        message: sharePriceHistory.message,
        sharePriceHistory: sharePriceHistory.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        sharePriceHistory: null,
      };
    }
  },

  async createSharePriceHistory(ctx: Context) {
    try {
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }
      
      const sharePriceHistoryData: SharePriceHistorySchemaCreate = await ctx.request.body().value;

      const createdSharePriceHistory = await sharePriceHistoryService.create(sharePriceHistoryData);
      ctx.response.status = createdSharePriceHistory.httpCode;
      ctx.response.body = {
        success: createdSharePriceHistory.success,
        message: createdSharePriceHistory.message,
        sharePriceHistory: createdSharePriceHistory.info,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        sharePriceHistory: null,
      };
    }
  },
};

export default SharePriceHistoryController;
