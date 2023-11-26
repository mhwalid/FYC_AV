import dbClient from "../database.connectDB.ts";
import { UserSchema, UserSchemaCreate, UserSchemaAccountUpdate, UserSchemaInfoUpdate, UserSchemaRoleUpdate } from "../schema/usersSchema.ts";

interface DeleteByIdResponse {
  success: boolean;
}

interface CreateResponse {
  success: boolean;
}

interface UpdateByIdResponse {
  success: boolean;
}

const UserService = {
  findAll: async (): Promise<UserSchema[]> => {
    try {
      const result = await dbClient.query(`SELECT * FROM users`);
      return result as UserSchema[];
      
    } catch (error) {
      throw new Error(`Error while fetching all users: ${error.message}`);
    }
  },
  findById: async (id: number): Promise<UserSchema | null> => {
    try {
      const result = await dbClient.query("SELECT * FROM users WHERE id = ?", [id]);
        return result.length > 0 ? result[0] as UserSchema : null as null;
    } catch (error) {
      throw new Error(`Error while fetching user by Id: ${error.message}`);
    }
  },
  findByEmail: async (email: string): Promise<UserSchema | null> => {
    try {
      const result = await dbClient.query("SELECT * FROM users WHERE email = ?", [email]);
        return result.length > 0 ? result[0] as UserSchema : null as null;
    } catch (error) {
      throw new Error(`Error while fetching user by Email: ${error.message}`);
    }
  },
  deleteById: async (id: number): Promise<DeleteByIdResponse> => {
    try {
      await dbClient.query("DELETE FROM users WHERE id = ?", [id]);
      return { success: true };
    } catch (error) {
      throw new Error(`Error while deleting user by Id: ${error.message}`);
    }
    },
  
  create: async (data: UserSchemaCreate): Promise<CreateResponse> => {
      try {
      await dbClient.query(
        "INSERT INTO users (first_name, last_name, email, password, account, is_cdu, cdu_accepted_at, register_at, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
        [
          data.firstName,
          data.lastName,
          data.email,
          data.password,
          data.account,
          data.isCdu,
          data.cduAcceptedAt,
          data.roleId,
        ]
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Error while creating user: ${error.message}`);
    }
  },
  updateUserRoleById: async (data: UserSchemaRoleUpdate): Promise<UpdateByIdResponse> => {
      try {
      await dbClient.query(
        "UPDATE users SET role_id = ?, updated_at = NOW() WHERE id = ?",
        [data.roleId, data.id]
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Error while updating user role by Id: ${error.message}`);
    }
  },
  updateUserInfoById: async (data: UserSchemaInfoUpdate): Promise<UpdateByIdResponse> => {
    const updates: string[] = [];

    if (data.firstName) updates.push(`first_name = '${data.firstName}'`);
    if (data.lastName) updates.push(`last_name = '${data.lastName}'`);
    if (data.email) updates.push(`email = '${data.email}'`);

    if (updates.length === 0) {
      return { success: false };
    }

      try {
      const updateString = updates.join(", ");
      await dbClient.query(
        `UPDATE users SET ${updateString}, updated_at = NOW() WHERE id = ?`,
        [data.id]
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Error while updating user info by Id: ${error.message}`);
    }
  },

  updateUserAccountById: async (data: UserSchemaAccountUpdate): Promise<UpdateByIdResponse> => {
      try { 
      await dbClient.query(
        "UPDATE users SET account = ?, updated_at = NOW() WHERE id = ?",
        [data.account, data.id]
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Error while updating user account by Id: ${error.message}`);
    }
  },
  
};

export default UserService;