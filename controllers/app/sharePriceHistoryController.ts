import { Context } from "../../deps.ts";
import sharePriceHistoryService from "../../services/sharePrice/sharePriceHistoryService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const SharePriceHistoryController = {
  async getAllSharePriceHistory(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ["GET"])) {
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

  async getSharePriceHistoryBySharePriceId(ctx: CustomContext) {
    try {
      if (!checkHttpMethod(ctx, ["GET"])) {
        return;
      }

      const sharePriceId = ctx.params.sharePriceId;
      const sharePriceHistory = await sharePriceHistoryService
        .findBySharePriceId(Number(sharePriceId));
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
};

export default SharePriceHistoryController;
