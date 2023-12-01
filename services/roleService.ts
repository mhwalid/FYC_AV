import dbClient from "../db/connectDb.ts";
import roleQueries from "../db/queries/rolesQueries.ts";
import { RoleSchema, RoleSchemaCreate, RoleSchemaUpdate } from "../schema/rolesSchema.ts";
import {
  FindResponse,
  FindOneResponse,
  DeleteByIdResponse,
  CreateResponse,
  UpdateByIdResponse,
  InfoResponse
} from "../schema/utils/responsesSchema.ts";

const roleService = {
  findAll: async (): Promise<FindResponse<RoleSchema>> => {
    try {
      const result = await dbClient.query(roleQueries.findAll);
      return {
        success: true,
        message: "Liste des roles récupèré avec succès",
        httpCode: 200,
        data: result as RoleSchema[]
      }
    } catch (error) {
      throw new Error(`Error while fetching all roles: ${error.message}`);
    }
  },

  findById: async (id: number): Promise<FindOneResponse<RoleSchema>> => {
    try {
      const role = await dbClient.query(roleQueries.findById, [id]);
      if (role.length === 0) {
        return {
          success: false,
          message: "Le role n'existe pas",
          httpCode: 404,
          data: null
        }
      }
      return {
        success: true,
        message: "Role récupèré avec succès",
        httpCode: 200,
        data: role as RoleSchema
      }
    } catch (error) {
      throw new Error(`Error while fetching role by Id: ${error.message}`);
    }
  },

  checkIfNameNotExists: async (name: string): Promise<FindOneResponse<RoleSchema>> => {
    try {
      const existingRole = await dbClient.query(roleQueries.findByName, [name]); 
      
      if (existingRole.length > 0) {
        return {
          success: false,
          message: "Un role avec le même nom existe déjà",
          httpCode: 409 ,
          data: existingRole[0] as RoleSchema
        }
      }
      return {
        success: true,
        message: "Le role n'existe pas",
        httpCode: 404,
        data: null
      }
    } catch (error) {
      throw new Error(`Error while checking role name existence: ${error.message}`);
    }
  },

  deleteById: async (id: number): Promise<DeleteByIdResponse> => {
    try {
      const resultExistRoleId = await roleService.findById(id)
      if (!resultExistRoleId.success) {
        return {
          success: false,
          message: resultExistRoleId.message,
          httpCode: resultExistRoleId.httpCode,
        }
      }

      // Vérifier si le rôle est utilisé par un utilisateur
      const isRoleInUse = await roleService.isRoleInUse(id)
      if (isRoleInUse) {
        return {
          success: false,
          message: "Erreur lors de la suppresion du role. Il est utilisé par au moins User",
          httpCode: 400,
        };
      }
      
      await dbClient.query(roleQueries.delete, [id]);
      
      return {
        success: true,
        message: "Le role a été supprimé avec succès",
        httpCode: 200,
      }
    } catch (error) {
      throw new Error(`Error while deleting role by Id: ${error.message}`);
    }
  },
  
  create: async (data: RoleSchemaCreate): Promise<CreateResponse<RoleSchema>> => {
    try { 
      const resultExistRoleName = await roleService.checkIfNameNotExists(data.name)
      if (!resultExistRoleName.success) {
        return {
          success: false,
          message: resultExistRoleName.message,
          httpCode: resultExistRoleName.httpCode,
          info: resultExistRoleName.data as RoleSchema
        }
      }
      
      const roleCreate = await dbClient.execute(
        roleQueries.create,
        [data.name]
      );

      return {
        success: true,
        message: "Role crée avec succès",
        httpCode: 201,
        info: roleCreate as InfoResponse
      }
    } catch (error) {
      throw new Error(`Error while creating role: ${error.message}`);
    }
  },

  updateById: async(data: RoleSchemaUpdate): Promise<UpdateByIdResponse<RoleSchema>> => {
    try {
      const resultExistRoleName = await roleService.checkIfNameNotExists(data.name)
      if (!resultExistRoleName.success) {
        return {
          success: false,
          message: resultExistRoleName.message,
          httpCode: resultExistRoleName.httpCode,
          data: resultExistRoleName.data as RoleSchema
        }
      }

      const resultExistRoleId = await roleService.findById(data.id)
      if (!resultExistRoleId.success) {
        return {
          success: false,
          message: resultExistRoleId.message,
          httpCode: resultExistRoleId.httpCode,
          data: resultExistRoleId.data as null
        }
      }
      
      const roleUpdate = await dbClient.query(roleQueries.update, [
        data.name,
        data.id,
      ]);

      return {
        success: true,
        message: "Role mis à jour avec succès",
        httpCode: 200,
        data: roleUpdate as InfoResponse
      }
    } catch (error) {
      throw new Error(`Error while updating role by Id: ${error.message}`);
    }
  },

  isRoleInUse: async (id: number): Promise<boolean> => {
    try {
      const result = await dbClient.query(roleQueries.checkRoleInUserUsage, [id]);
      return result[0].count > 0;
    } catch (error) {
      throw new Error(`Error while checking if role is in use: ${error.message}`);
    }
  },
};

export default roleService; 