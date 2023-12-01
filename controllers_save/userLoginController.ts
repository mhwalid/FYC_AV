import { Context } from "../deps.ts";
import userLoginService from "../services/userLoginService.ts";
import { UserLoginSchemaCreate } from '../schema/userLoginsSchema.ts';

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const UserLoginController = {
  async getAllUserLogins(ctx: Context) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const userLogins = await userLoginService.findAll();
      ctx.response.status = userLogins.httpCode;
      ctx.response.body = {
        success: userLogins.success,
        message: userLogins.message,
        userLogins: userLogins.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        userLogins: [],
      };
    }
  },

  async getUserLoginByUserId(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const userId = ctx.params.id;
      const userLogin = await userLoginService.findByUserId(Number(userId));
      ctx.response.status = userLogin.httpCode;
      ctx.response.body = {
        success: userLogin.success,
        message: userLogin.message,
        userLogin: userLogin.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        userLogin: null,
      };
    }
  },

  async createUserLogin(ctx: Context) {
    try {
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }
      
      const userLoginData: UserLoginSchemaCreate = await ctx.request.body().value;

      const createdUserLogin = await userLoginService.create(userLoginData);
      ctx.response.status = createdUserLogin.httpCode;
      ctx.response.body = {
        success: createdUserLogin.success,
        message: createdUserLogin.message,
        userLogin: createdUserLogin.info,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        userLogin: null,
      };
    }
  },
};

export default UserLoginController;
