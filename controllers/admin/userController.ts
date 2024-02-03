import { Context } from "../../deps.ts";
import userService from "../../services/user/userService.ts";
import { UserSchemaCreate } from "../../schema/user/usersSchema.ts";
import {
  UserSchemaActiveUpdate,
  UserSchemaRoleUpdate,
} from "../../schema/user/usersSchema.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";
import { UserSchemaFindAllFilters } from "../../schema/user/usersSchema.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const UserController = {
  async getAllUsers(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ["GET"])) {
        return;
      }

      const searchParams = ctx.request.url.searchParams;

      const filters: UserSchemaFindAllFilters = {
        isActive: Boolean(searchParams.get("isActive")) || undefined,
        roleId: Number(searchParams.get("roleId")) || undefined,
      };

      const users = await userService.findAll(filters);
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
      if (!checkHttpMethod(ctx, ["GET"])) {
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

  async createUser(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ["POST"])) {
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

  async updateActiveUser(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ["PATCH"])) {
        return;
      }

      const userData: UserSchemaActiveUpdate = await ctx.request.body().value;

      const registrationResponse = await userService.updateUserIsActive(
        userData,
      );

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

  async updateUserRole(ctx: CustomContext) {
    try {
      if (!checkHttpMethod(ctx, ["PATCH"])) {
        return;
      }

      const userId = ctx.params.userId;
      // Récupération des valeurs du Body
      const userData: UserSchemaRoleUpdate = await ctx.request.body().value;
      userData.id = Number(userId);

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
};

export default UserController;
