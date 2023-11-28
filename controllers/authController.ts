import { Context  } from "https://deno.land/x/oak/mod.ts";
import AuthenticationService from "../services/authService.ts";
import { UserSchemaCreate, UserSchemaLogin } from '../schema/usersSchema.ts';

const AuthController = {
  async register(ctx: Context) {
    try {
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
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
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
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
};

export default AuthController;
