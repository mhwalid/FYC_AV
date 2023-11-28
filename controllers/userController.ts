import { Context } from "../deps.ts";;
import userService from "../services/userService.ts";
import {
  UserSchemaCreate,
  UserSchemaAccountUpdate,
  UserSchemaInfoUpdate,
  UserSchemaRoleUpdate,
} from '../schema/usersSchema.ts';

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const UserController = {
  async getAllUsers(ctx: Context) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
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
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
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
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
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

  async updateUserRole(ctx: Context) {
    try {
      if (ctx.request.method !== 'PUT') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const userData: UserSchemaRoleUpdate = await ctx.request.body().value;

      const updatedUserRole = await userService.updateUserRoleById(userData);
      ctx.response.status = updatedUserRole.httpCode;
      ctx.response.body = {
        success: updatedUserRole.success,
        message: updatedUserRole.message,
        user: updatedUserRole.data,
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

  async updateUserInfo(ctx: Context) {
    try {
      if (ctx.request.method !== 'PUT') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const userData: UserSchemaInfoUpdate = await ctx.request.body().value;

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

  async updateUserAccount(ctx: Context) {
    try {
      if (ctx.request.method !== 'PUT') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const userData: UserSchemaAccountUpdate = await ctx.request.body().value;

      const updatedUserAccount = await userService.updateUserAccountById(userData);
      ctx.response.status = updatedUserAccount.httpCode;
      ctx.response.body = {
        success: updatedUserAccount.success,
        message: updatedUserAccount.message,
        user: updatedUserAccount.data,
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

  async deleteUser(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'DELETE') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const userId = ctx.params.id;
      const deletionResult = await userService.deleteById(Number(userId));
      ctx.response.status = deletionResult.httpCode;
      ctx.response.body = {
        success: deletionResult.success,
        message: deletionResult.message,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
      };
    }
  },
};

export default UserController;
