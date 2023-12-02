import { Context } from "../../deps.ts";;
import userService from "../../services/user/userService.ts";
import {
    UserSchemaWalletUpdate,
    UserSchemaInfoUpdate
} from '../../schema/user/usersSchema.ts';
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

interface CustomContext extends Context {
    params: {
        [key: string]: string;
    };
}

const UserController = {
    async getUserById(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const userId = ctx.params.userId;
            const user = await userService.findById(Number(userId));
            ctx.response.status = user.httpCode;
            ctx.response.body = {
                success: user.success,
                message: user.message,
                user: user.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                user: null,
            };
        }
    },


    async updateUserInfo(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['PUT'])) {
                return;
            }

            const userId = ctx.params.userId;
            const userData: UserSchemaInfoUpdate = await ctx.request.body().value;
            userData.id = Number(userId)

            const updatedUserInfo = await userService.updateUserInfoById(userData);
            ctx.response.status = updatedUserInfo.httpCode;
            ctx.response.body = {
                success: updatedUserInfo.success,
                message: updatedUserInfo.message,
                user: updatedUserInfo.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                user: null,
            };
        }
    },

    async updateUserWallet(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['PUT'])) {
                return;
            }

            const userId = ctx.params.userId;
            const userData: UserSchemaWalletUpdate = await ctx.request.body().value;
            userData.id = Number(userId)

            const updatedUserWallet = await userService.updateUserWalletById(userData);
            ctx.response.status = updatedUserWallet.httpCode;
            ctx.response.body = {
                success: updatedUserWallet.success,
                message: updatedUserWallet.message,
                user: updatedUserWallet.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                user: null,
            };
        }
    },
};

export default UserController;
