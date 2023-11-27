import { Context } from "https://deno.land/x/oak/mod.ts";
import UserService from "../services/userService.ts";
import {
  UserSchemaCreate,
  UserSchemaRoleUpdate,
  UserSchemaInfoUpdate,
  UserSchemaAccountUpdate,
} from "../schema/usersSchema.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const UserController = {
  async getAllUsers(ctx: Context) {
    try {
      const users = await UserService.findAll();
      ctx.response.status = 200;
      ctx.response.body = users;
    } catch (error) {
      console.error("Error in getAllUsers method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async getUserById(ctx: CustomContext) {
    try {
      const userId = ctx.params.id;

      const result = await UserService.findById(parseInt(userId));
      if (!result) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Utilisateur non trouvé" };
        return;
      }
      
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in getUserById method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async deleteUser(ctx: CustomContext) {
    try {
      const userId = ctx.params.id;

      const result = await UserService.deleteById(parseInt(userId));
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in deleteUser method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async createUser(ctx: Context) {
    try {
      const data: UserSchemaCreate = await ctx.request.body().value;

      // Vérification si l'e-mail existe déjà
      const existingUser = await UserService.findByEmail(data.email);
      
      if (existingUser) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Cet email est déjà associé à un utilisateur" };
        return;
      }

      const result = await UserService.create(data);
      ctx.response.status = 201;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in createUser method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async updateUserRole(ctx: CustomContext) {
    try {
      const userId = ctx.params.id;

      const data: UserSchemaRoleUpdate = await ctx.request.body().value;
      data.id = parseInt(userId);

      const existingUser = await UserService.findById(parseInt(userId));

      if (!existingUser) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Utilisateur non trouvé" };
        return;
      }

      const result = await UserService.updateUserRoleById(data);

      if (!result.success) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Aucune donnée mise à jour fournie" };
        return;
      }
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in updateUserRole method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async updateUserInfo(ctx: CustomContext) {
    try {
      const userId = ctx.params.id;

      const data: UserSchemaInfoUpdate = await ctx.request.body().value;
      data.id = parseInt(userId);

      const existingUser = await UserService.findById(parseInt(userId));

      if (!existingUser) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Utilisateur non trouvé" };
        return;
      }

      const result = await UserService.updateUserInfoById(data);

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in updateUserInfo method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async updateUserAccount(ctx: CustomContext) {
    try {
      const userId = ctx.params.id;

      const data: UserSchemaAccountUpdate = await ctx.request.body().value;
      data.id = parseInt(userId);

      const existingUser = await UserService.findById(parseInt(userId));

      if (!existingUser) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Utilisateur non trouvé" };
        return;
      }

      const result = await UserService.updateUserAccountById(data);

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in updateUserAccount method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },
};

export default UserController;