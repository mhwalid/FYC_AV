import { Context } from "../../deps.ts";
import AuthenticationService from "../../services/auth/authService.ts";
import { UserSchemaRegister, UserSchemaLogin, UserSchemaActiveUpdate } from '../../schema/user/usersSchema.ts';
import userService from "../../services/user/userService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";
import CookiesHandler from "../../utils/cookiesHandler.ts";

interface CustomContext extends Context {
    params: {
        [key: string]: string;
    };
}

const AuthController = {
    async register(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['POST'])) {
                return;
            }

            const userData: UserSchemaRegister = await ctx.request.body().value;

            const registrationResponse = await AuthenticationService.register(userData);

            // Ajoute le token dans les cookies utilisateurs
            if (registrationResponse.jwtToken !== undefined) {
                CookiesHandler.setLoginCookies(ctx, registrationResponse.jwtToken, registrationResponse.roleName ?? '', registrationResponse.userId as number);
            }

            ctx.response.status = registrationResponse.httpCode;
            ctx.response.body = {
                success: registrationResponse.success,
                message: registrationResponse.message,
                errors: registrationResponse.errors
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message
            };
        }
    },

    async login(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['POST'])) {
                return;
            }

            const userLogin: UserSchemaLogin = await ctx.request.body().value;
            const loginResponse = await AuthenticationService.login(userLogin);

            // Ajoute le token dans les cookies utilisateurs
            if (loginResponse.jwtToken !== null) {
                CookiesHandler.setLoginCookies(ctx, loginResponse.jwtToken ?? '', loginResponse.roleName ?? '', loginResponse.userId as number);
            }

            ctx.response.status = loginResponse.httpCode;
            ctx.response.body = {
                success: loginResponse.success,
                message: loginResponse.message
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message
            };
        }
    },

    async logout(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            if (await CookiesHandler.getCookie(ctx, 'token') === undefined) {
                ctx.response.status = 400;
                ctx.response.body = {
                    success: false,
                    message: "Vous n'êtes pas connecté"
                };
                return;
            }

            // Suppresion des cookies de connexion
            CookiesHandler.deleteLoginCookies(ctx)

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                message: "Vous venez de vous déconnecter"
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
            };
        }
    },

    async unsubscribe(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const userData: UserSchemaActiveUpdate = {
                id: Number(ctx.params.userId),
                isActive: false
            };

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
