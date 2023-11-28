  import { Context } from "https://deno.land/x/oak/mod.ts";
  import roleService from "../services/roleService.ts";
  import { RoleSchemaCreate, RoleSchemaUpdate } from '../schema/rolesSchema.ts';

  interface CustomContext extends Context {
    params: {
      [key: string]: string;
    };
  }

  const RoleController = {
    async getAllRoles(ctx: Context) {
      try {
        if (ctx.request.method !== 'GET') {
          ctx.response.status = 405;
          ctx.response.body = {
            success: false,
            message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
          };
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

    async getRoleById(ctx: CustomContext) {
      try {
        if (ctx.request.method !== 'GET') {
          ctx.response.status = 405;
          ctx.response.body = {
            success: false,
            message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
          };
          return;
        }

        const roleId = ctx.params.id;
        const role = await roleService.findById(Number(roleId));
        ctx.response.status = role.httpCode;
        ctx.response.body = {
          success: role.success,
          message: role.message,
          role: role.data,
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

    async createRole(ctx: Context) {
      try {
        if (ctx.request.method !== 'POST') {
          ctx.response.status = 405;
          ctx.response.body = {
            success: false,
            message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
          };
          return;
        }

        const roleData: RoleSchemaCreate =  await ctx.request.body().value;

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
        if (ctx.request.method !== 'PUT') {
          ctx.response.status = 405;
          ctx.response.body = {
            success: false,
            message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
          };
          return;
        }

        const roleId = ctx.params.id;
        const roleData: RoleSchemaUpdate = await ctx.request.body().value;
        roleData.id = Number(roleId)

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
        if (ctx.request.method !== 'DELETE') {
          ctx.response.status = 405;
          ctx.response.body = {
            success: false,
            message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
          };
          return;
        }

        const roleId = ctx.params.id;
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
