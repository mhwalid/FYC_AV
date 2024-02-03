import { Context } from "../../deps.ts";
import roleService from "../../services/user/roleService.ts";
import {
  RoleSchemaCreate,
  RoleSchemaUpdate,
} from "../../schema/user/rolesSchema.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const RoleController = {
  async getAllRoles(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ["GET"])) {
        return;
      }

      const roles = await roleService.findAll();
      ctx.response.status = roles.httpCode;
      ctx.response.body = {
        success: roles.success,
        message: roles.message,
        roles: roles.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        roles: [],
      };
    }
  },

  async createRole(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ["POST"])) {
        return;
      }

      const roleData: RoleSchemaCreate = await ctx.request.body().value;

      const createdRole = await roleService.create(roleData);
      ctx.response.status = createdRole.httpCode;
      ctx.response.body = {
        success: createdRole.success,
        message: createdRole.message,
        role: createdRole.info,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        role: null,
      };
    }
  },

  async updateRole(ctx: CustomContext) {
    try {
      if (!checkHttpMethod(ctx, ["PATCH"])) {
        return;
      }

      const roleId = ctx.params.roleId;
      const roleData: RoleSchemaUpdate = await ctx.request.body().value;
      roleData.id = Number(roleId);

      const updatedRole = await roleService.updateById(roleData);
      ctx.response.status = updatedRole.httpCode;
      ctx.response.body = {
        success: updatedRole.success,
        message: updatedRole.message,
        role: updatedRole.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        role: null,
      };
    }
  },

  async deleteRole(ctx: CustomContext) {
    try {
      if (!checkHttpMethod(ctx, ["DELETE"])) {
        return;
      }

      const roleId = ctx.params.roleId;
      const deletionResult = await roleService.deleteById(Number(roleId));
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

export default RoleController;
