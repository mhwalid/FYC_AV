import { Context } from "../../deps.ts";
import walletHistoryService from "../../services/walletHistoryService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const WalletHistoryController = {
  async findWalletHistoryByUserId(ctx: CustomContext) {
    try {
      if (!checkHttpMethod(ctx, ['GET'])) {
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
};

export default WalletHistoryController;
