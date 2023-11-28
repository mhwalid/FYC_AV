import dbClient from "../db/connectDb.ts";
import transactionsQueries from "../db/queries/transactionsQueries.ts";
import { TransactionSchema, TransactionSchemaCreate } from "../schema/transactionsSchema.ts";
import {
  FindResponse,
  FindOneResponse,
  CreateResponse,
  InfoResponse
} from "../schema/utils/responsesSchema.ts";
import userService from "./userService.ts"
import sharePriceService from "./sharePriceService.ts"

const transactionService = {
  findAll: async (): Promise<FindResponse<TransactionSchema>> => {
    try {
      const result = await dbClient.query(transactionsQueries.findAllTransactions);
      return {
        success: true,
        message: "Liste des transactions récupérée avec succès",
        httpCode: 200,
        data: result as TransactionSchema[],
      };
    } catch (error) {
      throw new Error(`Error while fetching all transactions: ${error.message}`);
    }
  },

  findById: async (id: number): Promise<FindOneResponse<TransactionSchema>> => {
    try {
      const transaction = await dbClient.query(transactionsQueries.findTransactionById, [id]);
      if (transaction.length === 0) {
        return {
          success: false,
          message: "La transaction n'existe pas",
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
      throw new Error(`Error while fetching transaction by Id: ${error.message}`);
    }
  },

  create: async (data: TransactionSchemaCreate): Promise<CreateResponse<TransactionSchema>> => {
    try {
      const userExists = await userService.findById(data.userId);
      if (!userExists.success) {
        return {
          success: false,
          message: userExists.message,
          httpCode: userExists.httpCode,
          info: userExists.data as null
        };
      }

      const sharePriceExists = await sharePriceService.findById(data.sharePriceId);
      if (!sharePriceExists.success) {
        return {
          success: false,
          message: sharePriceExists.message,
          httpCode: sharePriceExists.httpCode,
          info: sharePriceExists.data as null
        };
      }

      const result = await dbClient.query(
        transactionsQueries.createTransaction,
        [data.volume, data.typeTransaction, data.userId, data.sharePriceId]
      );
      return {
        success: true,
        message: "Transaction créée avec succès",
        httpCode: 201,
        info: result as InfoResponse,
      };
    } catch (error) {
      throw new Error(`Error while creating transaction: ${error.message}`);
    }
  },
};

export default transactionService;
