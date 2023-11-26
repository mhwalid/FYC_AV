import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import RoleService from "../services/roleService.ts";
import { RoleSchemaCreate, RoleSchemaUpdate } from "../schema/rolesSchema.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}


const RoleController = {
  async getAllRoles(ctx: Context) {
    try {
      const roles = await RoleService.findAll();
      ctx.response.status = 200;
      ctx.response.body = roles;
    } catch (error) {
      console.error("Error in getAllRoles method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async getRoleById(ctx: CustomContext) {
    try { 
      const roleId = ctx.params.id;
     
      if (!roleId) {
        ctx.response.status = 400;
        ctx.response.body = { error: "ID du rôle manquant dans les paramètres de l'URL" };
        return;
      }

      const result = await RoleService.findById(parseInt(roleId));
      if (!result) {
        ctx.response.status = 405;
        ctx.response.body = { error: "Rôle non trouvé" };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in getRoleById method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error :"};
    }
  },

  async createRole(ctx: Context) {
    try {
      const data: RoleSchemaCreate = await ctx.request.body().value;
      
      const nameExists = await RoleService.checkIfNameExists(data.name);
      if (nameExists) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Ce nom de rôle est déjà utilisé" };
        return;
      }

      const result = await RoleService.create(data);
      ctx.response.status = 201;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in createRole method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async updateRole(ctx: CustomContext) {
    try {
      const roleId = ctx.params.id;

      if (!roleId) {
        ctx.response.status = 400;
        ctx.response.body = { error: "ID du rôle manquant dans les paramètres de l'URL" };
        return;
      }

      const data: RoleSchemaUpdate = await ctx.request.body().value;
      data.id = parseInt(roleId);

      const nameExists = await RoleService.checkIfNameExists(data.name);
      if (nameExists) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Ce nom de rôle est déjà utilisé" };
        return;
      }

      const existingRole = await RoleService.findById(data.id);
      if (!existingRole) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Rôle non trouvé" };
        return;
      }

      const result = await RoleService.updateById(data);
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in updateRole method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async deleteRole(ctx: CustomContext) {
    try {
      const roleId = ctx.params.id;

      if (!roleId) {
        ctx.response.status = 400;
        ctx.response.body = { error: "ID du rôle manquant dans les paramètres de l'URL" };
        return;
      }

      const result = await RoleService.deleteById(parseInt(roleId));
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in deleteRole method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },
};

export default RoleController;