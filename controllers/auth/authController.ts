import { Context } from "../../deps.ts";
import AuthenticationService from "../../services/auth/authService.ts";
import { UserSchemaCreate, UserSchemaLogin, UserSchemaActiveUpdate } from '../../schema/user/usersSchema.ts';
import userService from "../../services/user/userService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

const AuthController = {
    async register(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['POST'])) {
                return;
            }

            const userData: UserSchemaCreate = await ctx.request.body().value;

            const registrationResponse = await AuthenticationService.register(userData);

            ctx.response.status = registrationResponse.httpCode;
            ctx.response.body = {
                success: registrationResponse.success,
                message: registrationResponse.message,
                jwtToken: registrationResponse.jwtToken,
            };
            // On ajoute le token dans le cookie du client
            if (registrationResponse.success && registrationResponse.jwtToken !== undefined) {
                ctx.cookies.set('token', registrationResponse.jwtToken, { httpOnly: true });
            }
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                jwtToken: undefined,
            };
        }
    },

    async login(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const userLogin: UserSchemaLogin = await ctx.request.body().value;
            const loginResponse = await AuthenticationService.login(userLogin);

            ctx.response.status = loginResponse.httpCode;
            ctx.response.body = {
                success: loginResponse.success,
                message: loginResponse.message,
                jwtToken: loginResponse.jwtToken,
            };
            // On ajoute le token dans le cookie du client
            if (loginResponse.success && loginResponse.jwtToken !== undefined) {
                ctx.cookies.set('token', loginResponse.jwtToken, { httpOnly: true });
            }
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                jwtToken: undefined,
            };
        }
    },

    logout() {
        return;
    },

    async unsubscribe(ctx: Context) {
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

export default AuthController;
