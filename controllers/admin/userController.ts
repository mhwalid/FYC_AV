import { Context } from "../../deps.ts";;
import userService from "../../services/userService.ts";
import {
    UserSchemaCreate
} from '../../schema/usersSchema.ts';
import { UserSchemaActiveUpdate } from "../../schema/usersSchema.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

interface CustomContext extends Context {
    params: {
        [key: string]: string;
    };
}

const UserController = {
    async getAllUsers(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const users = await userService.findAll();
            ctx.response.status = users.httpCode;
            ctx.response.body = {
                success: users.success,
                message: users.message,
                users: users.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                users: [],
            };
        }
    },

    async getUserById(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const userId = ctx.params.id;
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

    async createUser(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['POST'])) {
                return;
            }

            const userData: UserSchemaCreate = await ctx.request.body().value;

            const createdUser = await userService.create(userData);
            ctx.response.status = createdUser.httpCode;
            ctx.response.body = {
                success: createdUser.success,
                message: createdUser.message,
                user: createdUser.info,
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

    async unsubscribeUser(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['POST'])) {
                return;
            }

            const userData: UserSchemaActiveUpdate = await ctx.request.body().value;

            const registrationResponse = await userService.updateUserIsActive(userData);

            ctx.response.status = registrationResponse.httpCode;
            ctx.response.body = {
                success: registrationResponse.success,
                message: registrationResponse.message,
                data: registrationResponse.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                data: null,
            };
        }
    },
};

export default UserController;
