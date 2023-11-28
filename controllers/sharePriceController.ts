import { Context } from "https://deno.land/x/oak/mod.ts";
import sharePriceService from "../services/sharePriceService.ts";
import { SharePriceSchemaCreate, SharePriceSchemaUpdate } from '../schema/sharePricesSchema.ts';

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const SharePriceController = {
  async getAllSharePrices(ctx: Context) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const sharePrices = await sharePriceService.findAll();
      ctx.response.status = sharePrices.httpCode;
      ctx.response.body = {
        success: sharePrices.success,
        message: sharePrices.message,
        sharePrices: sharePrices.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        sharePrices: [],
      };
    }
  },

  async getSharePriceById(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const sharePriceId = ctx.params.id;
      const sharePrice = await sharePriceService.findById(Number(sharePriceId));
      ctx.response.status = sharePrice.httpCode;
      ctx.response.body = {
        success: sharePrice.success,
        message: sharePrice.message,
        sharePrice: sharePrice.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        sharePrice: null,
      };
    }
  },

  async createSharePrice(ctx: Context) {
    try {
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const sharePriceData: SharePriceSchemaCreate = await ctx.request.body().value;

      const createdSharePrice = await sharePriceService.create(sharePriceData);
      ctx.response.status = createdSharePrice.httpCode;
      ctx.response.body = {
        success: createdSharePrice.success,
        message: createdSharePrice.message,
        sharePrice: createdSharePrice.info,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        sharePrice: null,
      };
    }
  },

  async updateSharePrice(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'PUT') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const sharePriceId = ctx.params.id;
      const sharePriceData: SharePriceSchemaUpdate = await ctx.request.body().value;
      sharePriceData.id = Number(sharePriceId);

      const updatedSharePrice = await sharePriceService.updateById(sharePriceData);
      ctx.response.status = updatedSharePrice.httpCode;
      ctx.response.body = {
        success: updatedSharePrice.success,
        message: updatedSharePrice.message,
        sharePrice: updatedSharePrice.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        sharePrice: null,
      };
    }
  },

  async deleteSharePrice(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'DELETE') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const sharePriceId = ctx.params.id;
      const deletionResult = await sharePriceService.deleteById(Number(sharePriceId));
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
};

export default SharePriceController;
