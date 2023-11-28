import { Context } from "../deps.ts";;
import transactionService from "../services/transactionService.ts";
import { TransactionSchemaCreate } from '../schema/transactionsSchema.ts';

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const TransactionController = {
  async getAllTransactions(ctx: Context) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const transactions = await transactionService.findAll();
      ctx.response.status = transactions.httpCode;
      ctx.response.body = {
        success: transactions.success,
        message: transactions.message,
        transactions: transactions.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        transactions: [],
      };
    }
  },

  async getTransactionById(ctx: CustomContext) {
    try {
      if (ctx.request.method !== 'GET') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }

      const transactionId = ctx.params.id;
      const transaction = await transactionService.findById(Number(transactionId));
      ctx.response.status = transaction.httpCode;
      ctx.response.body = {
        success: transaction.success,
        message: transaction.message,
        transaction: transaction.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        transaction: null,
      };
    }
  },

  async createTransaction(ctx: Context) {
    try {
      if (ctx.request.method !== 'POST') {
        ctx.response.status = 405;
        ctx.response.body = {
          success: false,
          message: "Méthode :" + ctx.request.method + " non autorisée pour cette route.",
        };
        return;
      }
      
      const transactionData: TransactionSchemaCreate = await ctx.request.body().value;

      const createdTransaction = await transactionService.create(transactionData);
      ctx.response.status = createdTransaction.httpCode;
      ctx.response.body = {
        success: createdTransaction.success,
        message: createdTransaction.message,
        transaction: createdTransaction.info,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        transaction: null,
      };
    }
  },
};

export default TransactionController;
