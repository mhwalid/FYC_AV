import { Context } from "../../deps.ts";
import walletSharePriceService from "../../services/sharePrice/walletSharePriceService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";
import getConnectedUser from "../../utils/checkConnectedUser.ts";

interface CustomContext extends Context {
    params: {
        [key: string]: string;
    };
}

const WalletSharePriceController = {
    async findWalletSharePriceByUserId(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const userId = await getConnectedUser(ctx);
            if (!userId) {
                return
            }

            const userWalletSharePrice = await walletSharePriceService.findByUserId(userId);
            ctx.response.status = userWalletSharePrice.httpCode;
            ctx.response.body = {
                success: userWalletSharePrice.success,
                message: userWalletSharePrice.message,
                userWalletSharePrice: userWalletSharePrice.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                userWalletSharePrice: null,
            };
        }
    },

    async findUserSharePrice(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const userId = await getConnectedUser(ctx);

            if (!userId) {
                return
            }

            const sharePriceId = ctx.params.sharePriceId;

            const userSharePrice = await walletSharePriceService.findUserSharePrice(
                userId,
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
