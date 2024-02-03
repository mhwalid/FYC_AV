import { Context } from "../../deps.ts";
import walletHistoryService from "../../services/user/walletHistoryService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";
import getConnectedUser from "../../utils/checkConnectedUser.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const WalletHistoryController = {
  async findWalletHistoryByUserId(ctx: CustomContext) {
    try {
      if (!checkHttpMethod(ctx, ["GET"])) {
        return;
      }

      const userId = await getConnectedUser(ctx);
      if (!userId) {
        return;
      }

      const userWalletHistory = await walletHistoryService.findByUserId(userId);
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
