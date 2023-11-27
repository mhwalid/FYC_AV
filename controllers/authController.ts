import { Context } from "https://deno.land/x/oak/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import UserService from "../services/userService.ts";
import AuthentificationService from "../services/authService.ts";
import { UserSchemaLogin, UserSchemaCreate } from '../schema/usersSchema.ts'

const AuthentificationController = {
  async register(ctx: Context) {
    try {
      const data: UserSchemaCreate = await ctx.request.body().value;

      const existingUser = await UserService.findByEmail(data.email);
      if (existingUser) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Cet email est déjà associé à un utilisateur" };
        return;
      }

      const result = await AuthentificationService.register(data);
      ctx.response.status = 201;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in register method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async login(ctx: Context) {
    try {
      const data: UserSchemaLogin = await ctx.request.body().value;
      const { email, password } = data;

      // On ne donne pas trop d'information dans le type de retour
      if (!email || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Veuillez fournir un email et un mot de passe" };
        return;
      }

      const foundUser = await UserService.findByEmail(email);
      if (!foundUser || !foundUser?.password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Informations utilisateur incorrectes" };
        return;
      }

       // On ne donne pas trop d'information dans le type de retour
      const passwordMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordMatch) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Informations utilisateur incorrectes" };
        return;
      }

      const result = await AuthentificationService.login(data);
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in login method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },
};

export default AuthentificationController;
