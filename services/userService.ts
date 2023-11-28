import dbClient from "../db/connectDb.ts";
import usersQueries from "../db/queries/usersQueries.ts";
import {
  UserSchema,
  UserSchemaCreate,
  UserSchemaAccountUpdate,
  UserSchemaInfoUpdate,
  UserSchemaRoleUpdate,
} from "../schema/usersSchema.ts";
import {
  FindResponse,
  FindOneResponse,
  DeleteByIdResponse,
  CreateResponse,
  UpdateByIdResponse,
  InfoResponse
} from "../schema/utils/responsesSchema.ts";
import roleService from './roleService.ts'

const userService = {
  findAll: async (): Promise<FindResponse<UserSchema>> => {
    try {
      const result = await dbClient.query(usersQueries.findAllUsers);
      return {
        success: true,
        message: "Liste des utilisateurs récupérée avec succès",
        httpCode: 200,
        data: result as UserSchema[],
      };
    } catch (error) {
      throw new Error(`Error while fetching all users: ${error.message}`);
    }
  },

  findById: async (id: number): Promise<FindOneResponse<UserSchema>> => {
    try {
      const result = await dbClient.query(usersQueries.findUserById, [id]);
      if (result.length === 0) {
        return {
          success: false,
          message: "L'utilisateur n'existe pas",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Utilisateur récupéré avec succès",
        httpCode: 200,
        data: result[0] as UserSchema,
      };
    } catch (error) {
      throw new Error(`Error while fetching user by Id: ${error.message}`);
    }
  },

  findByEmail: async (email: string): Promise<FindOneResponse<UserSchema>> => {
    try {
      const result = await dbClient.query(usersQueries.findUserByEmail, [email]);
      if (result.length === 0) {
        return {
          success: false,
          message: "L'utilisateur avec cet email n'existe pas",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Utilisateur récupéré avec succès",
        httpCode: 200,
        data: result[0] as UserSchema,
      };
    } catch (error) {
      throw new Error(`Error while fetching user by Email: ${error.message}`);
    }
  },

  deleteById: async (id: number): Promise<DeleteByIdResponse> => {
    try {
      const resultExistUserId = await userService.findById(id);
      if (!resultExistUserId.success) {
        return {
          success: false,
          message: resultExistUserId.message,
          httpCode: resultExistUserId.httpCode,
        };
      }

      const isUserInTransaction = await userService.isUserInTransaction(id);
      if (isUserInTransaction) {
        return {
          success: false,
          message: "Erreur lors de la suppression de l'utilisateur. Il est associé à au moins une transaction",
          httpCode: 400,
        };
      }

      await dbClient.query(usersQueries.deleteUserById, [id]);
      return {
        success: true,
        message: "L'utilisateur a été supprimé avec succès",
        httpCode: 200,
      };
    } catch (error) {
      throw new Error(`Error while deleting user by Id: ${error.message}`);
    }
  },

  create: async (data: UserSchemaCreate): Promise<CreateResponse<UserSchema>> => {
    try {
      const resultExistUserEmail = await userService.findByEmail(data.email);
      if (resultExistUserEmail.success) {
        return {
          success: false,
          message: "Ce mail est déjà associé à un utilisateur",
          httpCode: 409,
          info: resultExistUserEmail.data as UserSchema,
        };
      }

      const roleExists = await roleService.findById(data.roleId);
      if (!roleExists.success) {
        return {
          success: false,
          message: roleExists.message,
          httpCode: roleExists.httpCode,
          info: roleExists.data as null
        };
      }

      const result = await dbClient.query(
        usersQueries.createUser,
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
      return {
        success: true,
        message: "User créé avec succès",
        httpCode: 201,
        info: result as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Error while creating user: ${error.message}`);
    }
  },

  updateUserRoleById: async (data: UserSchemaRoleUpdate): Promise<UpdateByIdResponse<UserSchema>> => {
    try {
      const resultExistUserId = await userService.findById(data.id);
      if (!resultExistUserId.success) {
        return {
          success: false,
          message: resultExistUserId.message,
          httpCode: resultExistUserId.httpCode,
          data: resultExistUserId.data as null
        };
      }

      const userUpdate = await dbClient.query(
        usersQueries.updateUserRoleById,
        [data.roleId, data.id]
      );
      return {
        success: true,
        message: "Rôle de l'utilisateur mis à jour avec succès",
        httpCode: 200,
        data: userUpdate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Error while updating user role by Id: ${error.message}`);
    }
  },

  updateUserInfoById: async (data: UserSchemaInfoUpdate): Promise<UpdateByIdResponse<UserSchema>> => {
    const updates: string[] = [];
    const updateParams: any[] = [];
    
    if (data.firstName) {
      updates.push(`first_name = ?`);
      updateParams.push(data.firstName);
    }
    if (data.lastName) {
      updates.push(`last_name = ?`);
      updateParams.push(data.lastName);
    }
    if (data.email) {
      updates.push(`email = ?`);
      updateParams.push(data.email);
    }

    try {
      const resultExistUserId = await userService.findById(data.id);
      if (!resultExistUserId.success) {
        return {
          success: false,
          message: resultExistUserId.message,
          httpCode: resultExistUserId.httpCode,
          data: resultExistUserId.data as null
        };
      }

      if (data.email !== undefined) {
        const resultExistUserEmail = await userService.findByEmail(data.email);
        if (resultExistUserEmail.success) {
          return {
            success: false,
            message: "Ce mail est déjà associé à un utilisateur",
            httpCode: 409,
            data: resultExistUserEmail.data as UserSchema,
          };
        }
      }

      const updateString = updates.join(", ");
      updateParams.push(data.id);

      const query = usersQueries.updateUserInfoById.replace(`{updateString}`, updateString);
      const userUpdate = await dbClient.query(query, updateParams);

      return {
        success: true,
        message: "Informations de l'utilisateur mises à jour avec succès",
        httpCode: 200,
        data: userUpdate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Error while updating user info by Id: ${error.message}`);
    }
  },

  updateUserAccountById: async (data: UserSchemaAccountUpdate): Promise<UpdateByIdResponse<UserSchema>> => {
    try {
      const resultExistUserId = await userService.findById(data.id);
      if (!resultExistUserId.success) {
        return {
          success: false,
          message: resultExistUserId.message,
          httpCode: resultExistUserId.httpCode,
          data: resultExistUserId.data as null
        };
      }

      const userUpdate = await dbClient.query(
        usersQueries.updateUserAccountById,
        [data.account, data.id]
      );

      return {
        success: true,
        message: "Compte de l'utilisateur mis à jour avec succès",
        httpCode: 200,
        data: userUpdate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Error while updating user account by Id: ${error.message}`);
    }
  },

  // Ajout de la méthode pour vérifier si l'utilisateur est associé à une transaction
  isUserInTransaction: async (id: number): Promise<boolean> => {
    try {
      const result = await dbClient.query(usersQueries.checkUserInTransactionUsage, [id]);
      return result[0].count > 0;
    } catch (error) {
      throw new Error(`Error while checking if user is in transaction: ${error.message}`);
    }
  },
};


export default userService;
