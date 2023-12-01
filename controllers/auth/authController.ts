import { Context } from "../../deps.ts";
import AuthenticationService from "../../services/authService.ts";
import userLoginService from "../../services/userLoginService.ts";
import { UserSchemaCreate, UserSchemaLogin, UserSchemaActiveUpdate } from '../../schema/usersSchema.ts';
import { UserLoginSchemaCreate } from "../../schema/userLoginsSchema.ts";
import userService from "../../services/userService.ts";
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
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                jwtToken: undefined,
            };
        }
    },

    async logout(ctx: Context) {
        try {
            const authHeader = ctx.request.headers.get('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                ctx.response.status = 401;
                ctx.response.body = {
                    success: false,
                    message: "Unauthorized: No token provided",
                };
                return;
            }

            const token = authHeader.substring(7); // Pour obtenir le token JWT sans 'Bearer '

            // Ici, vous devriez décoder le token pour obtenir les informations contenues
            const decodedToken: any = AuthenticationService.verifyJWTToken(token);

            const userId = decodedToken.foundUserId; // Supposons que l'ID de l'utilisateur soit stocké sous 'foundUserId'

            const logoutSuccess = await AuthenticationService.logout(userId);

            if (logoutSuccess) {
                ctx.response.status = 200;
                ctx.response.body = {
                    success: true,
                    message: "Déconnexion réussie",
                };
            } else {
                ctx.response.status = 500;
                ctx.response.body = {
                    success: false,
                    message: "Échec de la déconnexion",
                };
            }
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
            };
        }
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
