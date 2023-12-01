import dbClient from "../db/connectDb.ts";
import usersQueries from "../db/queries/usersQueries.ts";
import {
  UserSchema,
  UserSchemaCreate,
  UserSchemaWalletUpdate,
  UserSchemaInfoUpdate,
  UserSchemaRoleUpdate,
  UserSchemaActiveUpdate
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
import walletHistoryService from "./walletHistoryService.ts";
import { WalletHistorySchemaCreate } from "../schema/walletHistorySchema.ts";

const userService = {
  findAll: async (): Promise<FindResponse<UserSchema>> => {
    try {
      const result = await dbClient.query(usersQueries.findAll);
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
      const result = await dbClient.query(usersQueries.findById, [id]);
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
      const result = await dbClient.query(usersQueries.findByEmail, [email]);
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

      await dbClient.query(usersQueries.delete, [id]);
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
        usersQueries.create,
        [
          data.firstName,
          data.lastName,
          data.email,
          data.password,
          data.wallet,
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
        usersQueries.updateRole,
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

      const updateParams = buildUpdateParams(data);
      const updateString = buildUpdateString(data);

      const query = usersQueries.updateInfo.replace(`{updateString}`, updateString);
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

  updateUserWalletById: async (data: UserSchemaWalletUpdate): Promise<UpdateByIdResponse<UserSchema>> => {
    try {
      const resultExistUserId = await userService.findById(data.id);
      if (!resultExistUserId.success || resultExistUserId.data === null) {
        return {
          success: false,
          message: resultExistUserId.message,
          httpCode: resultExistUserId.httpCode,
          data: resultExistUserId.data as null
        };
      }

      let responseMessage = "";
      let wallet = resultExistUserId.data?.wallet;
      let typeOperation = "";

      if (data.value >= 0) {
        wallet += data.value;
        typeOperation = 'GAIN'
        responseMessage = `Argent ajouté : ${data.value}€. Total : ${wallet}€`;
      } else {
        typeOperation = 'PERTE'
        // Valeur absolue pour éviter un négatif
        const value = Math.abs(data.value)
        if (wallet >= value) {
          wallet -= value;
          responseMessage = `Argent retiré : ${value}€. Total : ${wallet}€`;
        } else {
          return {
            success: false,
            message: "Pas assez d'argent dans votre portefeuille",
            httpCode: 400,
            data: null,
          };
        }
      }

      const userUpdate = await dbClient.query(
        usersQueries.updateWallet,
        [wallet, data.id]
      );

      // On historise le nouveau portefeuille
      const sharePriceHistory: WalletHistorySchemaCreate = {
        value: wallet,
        operationType: typeOperation,
        userId: data.id
      }
      await walletHistoryService.create(sharePriceHistory);

      return {
        success: true,
        message: "Portefeuille de l'utilisateur mis à jour : " + responseMessage,
        httpCode: 200,
        data: userUpdate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Error while updating user wallet by Id: ${error.message}`);
    }
  },

  updateUserIsActive: async (data: UserSchemaActiveUpdate): Promise<UpdateByIdResponse<UserSchema>> => {
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
        usersQueries.updateIsActive,
        [data.isActive, data.id]
      );

      return {
        success: true,
        message: "Compte de l'utilisateur mis à jour avec succès",
        httpCode: 200,
        data: userUpdate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Error while updating user active by Id: ${error.message}`);
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

const buildUpdateParams = (data: UserSchemaInfoUpdate): any[] => {
  const updateParams: any[] = [];
  if (data.firstName) {
    updateParams.push(data.firstName);
  }
  if (data.lastName) {
    updateParams.push(data.lastName);
  }
  if (data.email) {
    updateParams.push(data.email);
  }

  updateParams.push(data.id)
  return updateParams;
};

const buildUpdateString = (data: UserSchemaInfoUpdate): string => {
  const updates: string[] = [];
  if (data.firstName) {
    updates.push(`first_name = ?`);
  }
  if (data.lastName) {
    updates.push(`last_name = ?`);
  }
  if (data.email) {
    updates.push(`email = ?`);
  }
  return updates.join(", ");
};


export default userService;
