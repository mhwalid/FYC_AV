import dbClient from "../database.connectDB.ts";
import { RoleSchema, RoleSchemaCreate, RoleSchemaUpdate } from "../schema/rolesSchema.ts";

// Interface spécifique à chaque opération CRUD pour RoleSchema
interface DeleteByIdResponse {
  success: boolean;
}

interface CreateResponse {
  success: boolean;
}

interface UpdateByIdResponse {
  success: boolean;
}

const RoleService = {
  findAll: async (): Promise<RoleSchema[]> => {
    try {
      const result = await dbClient.query(`SELECT * FROM roles`);
      return result as RoleSchema[];
    } catch (error) {
      throw new Error(`Error while fetching all roles: ${error.message}`);
    }
  },

  findById: async (id: number): Promise< RoleSchema | null> => {
    try {
      const result = await dbClient.query("SELECT * FROM roles WHERE id = ?", [id]);
      return result.length > 0 ? result[0] as RoleSchema : null as null;
    } catch (error) {
      throw new Error(`Error while fetching role by Id: ${error.message}`);
    }
  },

  checkIfNameExists: async (name: string): Promise<boolean> => {
    try {
      const existingRoleQuery = `SELECT * FROM roles WHERE name = ?`;
      const existingRole = await dbClient.query(existingRoleQuery, [name]);
      return existingRole.length > 0;
    } catch (error) {
      throw new Error(`Error while checking role name existence: ${error.message}`);
    }
  },

  deleteById: async (id: number): Promise<DeleteByIdResponse> => {
    try {
      await dbClient.query("DELETE FROM roles WHERE id = ?", [id]);
      return { success: true };
    } catch (error) {
      throw new Error(`Error while deleting role by Id: ${error.message}`);
    }
  },
  
  create: async (data: RoleSchemaCreate): Promise<CreateResponse> => {
    try { 
      await dbClient.execute(
        "INSERT INTO roles (name, created_at) VALUES (?, NOW())",
        [data.name]
      );

      return { success: true };
    } catch (error) {
      throw new Error(`Error while creating role: ${error.message}`);
    }
  },

  updateById: async(data: RoleSchemaUpdate): Promise<UpdateByIdResponse> => {
    try {
      await dbClient.query("UPDATE roles SET name = ?, updated_at = NOW() WHERE id = ?", [
        data.name,
        data.id,
      ]);

      return { success: true };
    } catch (error) {
      throw new Error(`Error while updating role by Id: ${error.message}`);
    }
  },
};

export default RoleService;