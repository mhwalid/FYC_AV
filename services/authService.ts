import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.9.1/mod.ts";
import { key } from "../utils/apiKeys.ts";
import dbClient from "../database.connectDB.ts";
import { UserSchemaLogin, UserSchemaCreate } from '../schema/usersSchema.ts'
import UserService from "./userService.ts";


interface RegisterResponse {
  success: boolean;
}

interface LoginResponse {
  jwtToken: string;
}

const AuthentificationService = {
  async register(data: UserSchemaCreate): Promise<RegisterResponse> {
    try {
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const query = `
        INSERT INTO users (firstName, lastName, email, password, account, isCdu, cduAcceptedAt, registerAt, roleId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `;
      const values = [
        data.firstName,
        data.lastName,
        data.email,
        hashedPassword,
        data.account,
        data.isCdu,
        data.cduAcceptedAt,
        data.roleId,
      ];

      await dbClient.query(query, values);
      return { success: true };
    } catch (error) {
      throw new Error(`Error while creating user: ${error.message}`);
    }
  },


  async login(userLogin: UserSchemaLogin): Promise<LoginResponse> {
    try {

    const { email, password } = userLogin;
    const foundUser = await UserService.findByEmail(email);

    if (!foundUser || !foundUser?.password) {
      throw new Error('Informations utilisateur incorrectes');
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      throw new Error('Mot de passe incorrect');
    }

    const payload = { foundUserId: foundUser.id };
    const jwtToken = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
      return { jwtToken: jwtToken };
    } catch (error) {
      throw new Error(`Error while login user: ${error.message}`);
    }
  },
};

export default AuthentificationService;