import dbClient from "../../db/connectDb.ts";
import transactionsQueries from "../../db/queries/transaction/transactionsQueries.ts";
import {
  TransactionSchema,
  TransactionSchemaCreate,
} from "../../schema/transaction/transactionsSchema.ts";
import {
  CreateResponse,
  FindOneResponse,
  FindResponse,
  InfoResponse,
} from "../../schema/utils/responsesSchema.ts";
import userService from "../user/userService.ts";

const transactionService = {
  findAll: async (): Promise<FindResponse<TransactionSchema>> => {
    try {
      const result = await dbClient.query(transactionsQueries.findAll);
      return {
        success: true,
        message: "Liste des transactions récupérée avec succès",
        httpCode: 200,
        data: result as TransactionSchema[],
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupérations des transactions : ${error.message}`,
      );
    }
  },

  findByUserId: async (
    userId: number,
  ): Promise<FindResponse<TransactionSchema>> => {
    try {
      const userExists = await userService.findById(userId);
      if (!userExists.success) {
        return {
          success: false,
          message: userExists.message,
          httpCode: userExists.httpCode,
          data: userExists.data as null,
        };
      }

      const transactions = await dbClient.query(
        transactionsQueries.findByUserId,
        [userId],
      );
      if (transactions.length === 0) {
        return {
          success: false,
          message: "Erreur l'utilisateur n'a pas de transaction",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Transactions de l'utilisateur récupérées avec succès",
        httpCode: 200,
        data: transactions as TransactionSchema[],
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des transactions de l'utilisateur : ${error.message}`,
      );
    }
  },

  findById: async (id: number): Promise<FindOneResponse<TransactionSchema>> => {
    try {
      const transaction = await dbClient.query(transactionsQueries.findById, [
        id,
      ]);
      if (transaction.length === 0) {
        return {
          success: false,
          message: "Erreur la transaction n'existe pas",
          httpCode: 404,
          data: null,
        };
      }
      return {
        success: true,
        message: "Transaction récupérée avec succès",
        httpCode: 200,
        data: transaction[0] as TransactionSchema,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de la transaction : ${error.message}`,
      );
    }
  },

  create: async (
    data: TransactionSchemaCreate,
  ): Promise<CreateResponse<InfoResponse>> => {
    try {
      const result = await dbClient.query(
        transactionsQueries.create,
        [
          data.volume,
          data.value,
          data.typeTransaction,
          data.userId,
          data.sharePriceHistoryId,
        ],
      );
      return {
        success: true,
        message: "Transaction créée avec succès",
        httpCode: 201,
        info: result as InfoResponse,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la création de la transaction : ${error.message}`,
      );
    }
  },
};

export default transactionService;
