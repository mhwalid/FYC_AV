import { Context } from "https://deno.land/x/oak/mod.ts";
import SharePriceService from "../services/sharePriceService.ts";
import { SharePriceSchemaCreate, SharePriceSchemaUpdate } from "../schema/sharePricesSchema.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const SharePriceController = {
  async getAllSharePrices(ctx: Context) {
    try {
      const sharePrices = await SharePriceService.findAll();
      ctx.response.status = 200;
      ctx.response.body = sharePrices;
    } catch (error) {
      console.error("Error in getAllSharePrices method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async getSharePriceById(ctx: CustomContext) {
    try {
      const sharePriceId = ctx.params.id;

      if (!sharePriceId) {
        ctx.response.status = 400;
        ctx.response.body = { error: "ID du prix d'actions manquant dans les paramètres de l'URL" };
        return;
      }

      const result = await SharePriceService.findById(parseInt(sharePriceId));
      if (!result) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Prix d'actions non trouvé" };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in getSharePriceById method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async createSharePrice(ctx: Context) {
    try {
      const data: SharePriceSchemaCreate = await ctx.request.body().value;
      
      const nameExists = await SharePriceService.checkIfNomExists(data.name);
      if (nameExists) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Ce nom de prix d'actions est déjà utilisé" };
        return;
      }

      const result = await SharePriceService.create(data);
      ctx.response.status = 201;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in createSharePrice method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async updateSharePrice(ctx: CustomContext) {
    try {
      const sharePriceId = ctx.params.id;

      if (!sharePriceId) {
        ctx.response.status = 400;
        ctx.response.body = { error: "ID du prix d'actions manquant dans les paramètres de l'URL" };
        return;
      }

      const data: SharePriceSchemaUpdate = await ctx.request.body().value;
      data.id = parseInt(sharePriceId);

      const nameExists = await SharePriceService.checkIfNomExists(data.name);
      if (nameExists) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Ce nom de prix d'actions est déjà utilisé" };
        return;
      }

      const existingSharePrice = await SharePriceService.findById(data.id);
      if (!existingSharePrice) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Prix d'actions non trouvé" };
        return;
      }

      const result = await SharePriceService.updateById(data);
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in updateSharePrice method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async deleteSharePrice(ctx: CustomContext) {
    try {
      const sharePriceId = ctx.params.id;
  
      if (!sharePriceId) {
        ctx.response.status = 400;
        ctx.response.body = { error: "ID du prix d'actions manquant dans les paramètres de l'URL" };
        return;
      }
  
      const result = await SharePriceService.deleteById(parseInt(sharePriceId));
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in deleteSharePrice method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

};

export default SharePriceController;
