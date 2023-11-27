import dbClient from "../database.connectDB.ts";
import { RoleSchema, RoleSchemaCreate, RoleSchemaUpdate } from "../schema/rolesSchema.ts";

// Interface spécifique à chaque opération CRUD pour RoleSchema
interface FindAllResponse {
  success: boolean;
  message: string;
  data: RoleSchema[];
}

interface FindOneResponse {
  success: boolean;
  message: string;
  data: RoleSchema;
}

interface DeleteByIdResponse {
  success: boolean;
  message: string;
  datas: RoleSchema[];
}

interface CreateResponse {
  success: boolean;
  message: string;
}

interface UpdateByIdResponse {
  success: boolean;
  message: string;
}

const RoleService = {
  findAll: async (): Promise<FindAllResponse> => {
    try {
      const result = await dbClient.query(`SELECT * FROM roles`);
      return {
        success: true,
        message: "Liste des roles récupèré avec succès",
        data: result as RoleSchema[]
      }
    } catch (error) {
      throw new Error(`Error while fetching all roles: ${error.message}`);
    }
  },

  findById: async (id: number): Promise< FindOneResponse | null> => {
    try {
      const result = await dbClient.query("SELECT * FROM roles WHERE id = ?", [id]);
      return {
        success: true,
        message: "Liste des roles récupèré avec succès",
        data: result as RoleSchema
      }
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
      // Vérifier si le rôle est utilisé par un utilisateur
      const isRoleInUse = await dbClient.query("SELECT COUNT(*) as count FROM users WHERE role_id = ?", [id]);

      if (isRoleInUse[0].count > 0) {
        return { success: false, error: "Ce rôle est utilisé par un ou plusieurs utilisateurs et ne peut pas être supprimé." };
        }
      
      await dbClient.query("DELETE FROM roles WHERE id = ?", [id]);
      return { success: true , error: "Le role a été supprimé avec success"};
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
  isRoleInUse: async (roleId: number): Promise<boolean> => {
    try {
      const result = await dbClient.query("SELECT COUNT(*) as count FROM users WHERE role_id = ?", [roleId]);
      return result[0].count > 0;
    } catch (error) {
      throw new Error(`Error while checking if role is in use: ${error.message}`);
    }
  },
};

export default RoleService;