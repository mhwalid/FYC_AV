import { Context } from "../../deps.ts";
import sharePriceService from "../../services/sharePrice/sharePriceService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const SharePriceController = {
  async getAllSharePrices(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ['GET'])) {
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
      if (!checkHttpMethod(ctx, ['GET'])) {
        return;
      }

      const sharePriceId = ctx.params.sharePriceId;
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
};

export default SharePriceController;
