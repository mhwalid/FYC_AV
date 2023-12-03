import dbClient from "../../db/connectDb.ts";
import { bcrypt } from "../../deps.ts";
import usersQueries from "../../db/queries/user/usersQueries.ts";
import {
  UserSchema,
  UserSchemaCreate,
  UserSchemaWalletUpdate,
  UserSchemaInfoUpdate,
  UserSchemaRoleUpdate,
  UserSchemaActiveUpdate,
  UserSchemaRegister
} from "../../schema/user/usersSchema.ts";
import {
  FindResponse,
  FindOneResponse,
  CreateResponse,
  UpdateByIdResponse,
  InfoResponse
} from "../../schema/utils/responsesSchema.ts";
import roleService from './roleService.ts'
import walletHistoryService from "./walletHistoryService.ts";
import { WalletHistorySchemaCreate } from "../../schema/user/walletHistorySchema.ts";
import { UserSchemaFindAllFilters } from "../../schema/user/usersSchema.ts";

const userService = {
  findAll: async (filters?: UserSchemaFindAllFilters): Promise<FindResponse<UserSchema>> => {
    try {
      let query = 'SELECT * FROM users';
      const queryParams: any[] = [];

      if (filters) {
        const conditions: string[] = [];

        if (filters.isActive !== undefined) {
          conditions.push('is_active = ?');
          queryParams.push(filters.isActive);
        }

        if (filters.roleId) {
          conditions.push('role_id = ?');
          queryParams.push(filters.roleId);
        }

        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
      }

      const result = await dbClient.query(query, queryParams);

      return {
        success: true,
        message: "Liste des utilisateurs récupérée avec succès",
        httpCode: 200,
        data: result as UserSchema[],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la liste des utilisateurs : ${error.message}`);
    }
  },

  findById: async (id: number): Promise<FindOneResponse<UserSchema>> => {
    try {
      const result = await dbClient.query(usersQueries.findById, [id]);
      if (result.length === 0) {
        return {
          success: false,
          message: "Erreur l'utilisateur n'existe pas",
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
      throw new Error(`Erreur lors de la récupération de l'utilisateur : ${error.message}`);
    }
  },

  findByEmail: async (email: string): Promise<FindOneResponse<UserSchema>> => {
    try {
      const result = await dbClient.query(usersQueries.findByEmail, [email]);
      if (result.length === 0) {
        return {
          success: false,
          message: "Erreur l'utilisateur avec cet email n'existe pas",
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
      throw new Error(`Erreur lors de la récupération de l'utilisateur par son email : ${error.message}`);
    }
  },

  create: async (data: UserSchemaCreate): Promise<CreateResponse<UserSchema>> => {
    try {
      const resultExistUserEmail = await userService.findByEmail(data.email);
      if (resultExistUserEmail.success) {
        return {
          success: false,
          message: "Erreur ce mail est déjà associé à un utilisateur",
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

      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const userData = {
        ...data,
        password: hashedPassword,
        cduAcceptedAt: data.isCdu ? new Date() : null,
      } as UserSchemaCreate;

      const result = await dbClient.query(
        usersQueries.create,
        [
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.password,
          userData.wallet,
          userData.isCdu,
          userData.cduAcceptedAt,
          userData.roleId,
        ]
      );
      return {
        success: true,
        message: "Utilisateur créé avec succès",
        httpCode: 201,
        info: result as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'utilisateur : ${error.message}`);
    }
  },

  register: async (data: UserSchemaRegister): Promise<CreateResponse<UserSchema>> => {
    try {
      const resultExistUserEmail = await userService.findByEmail(data.email);
      if (resultExistUserEmail.success) {
        return {
          success: false,
          message: "Erreur ce mail est déjà associé à un utilisateur",
          httpCode: 409,
          info: resultExistUserEmail.data as UserSchema,
        };
      }

      const resultNotExistRoleName = await roleService.checkIfNameNotExists("USER")
      if (resultNotExistRoleName.success) {
        return {
          success: !resultNotExistRoleName.success,
          message: resultNotExistRoleName.message,
          httpCode: resultNotExistRoleName.httpCode,
          info: null
        }
      }

      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const userData = {
        ...data,
        password: hashedPassword,
        cduAcceptedAt: data.isCdu ? new Date() : null,
      } as UserSchemaCreate;

      const result = await dbClient.query(
        usersQueries.create,
        [
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.password,
          userData.wallet,
          userData.isCdu,
          userData.cduAcceptedAt,
          resultNotExistRoleName.data?.id
        ]
      );
      return {
        success: true,
        message: "Utilisateur enregistré avec succès",
        httpCode: 201,
        info: result as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'enregistrement de l'utilisateur : ${error.message}`);
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
          data: null
        };
      }

      const resultExistRoleId = await roleService.findById(data.roleId)
      if (!resultExistRoleId.success) {
        return {
          success: false,
          message: resultExistRoleId.message,
          httpCode: resultExistRoleId.httpCode,
          data: null
        }
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
      throw new Error(`Erreur lors de la mise à jour du role de l'utilisateur : ${error.message}`);
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
            message: "Erreur ce mail est déjà associé à un utilisateur",
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
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur : ${error.message}`);
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

      if (typeof wallet === "string") {
        wallet = parseFloat(wallet)
      }

      if (data.value >= 0) {
        wallet = wallet + data.value;
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
            message: "Erreur pas assez d'argent dans votre portefeuille",
            httpCode: 400,
            data: null,
          };
        }
      }

      const userUpdate = await dbClient.query(
        usersQueries.updateWallet,
        [parseFloat(wallet.toFixed(2)), data.id]
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
      throw new Error(`Erreur lors de la mise à jour du portefeuille de l'utilisateur : ${error.message}`);
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
        message: "Activité de l'utilisateur mis à jour avec succès",
        httpCode: 200,
        data: userUpdate as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Erreur lors de mise à jour de l'activité de l'utilisateur : ${error.message}`);
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
