import { Context } from "../../deps.ts";
import sharePriceService from "../../services/sharePrice/sharePriceService.ts";
import { SharePriceSchemaCreate } from "../../schema/sharePrice/sharePricesSchema.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

const SharePriceController = {
  async createSharePrice(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ["POST"])) {
        return;
      }

      const sharePriceData: SharePriceSchemaCreate = await ctx.request.body()
        .value;
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
};

export default SharePriceController;
