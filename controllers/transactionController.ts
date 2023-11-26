import { Context } from "https://deno.land/x/oak/mod.ts";
import TransactionService from "../services/transactionService.ts";
import { TransactionSchemaCreate } from "../schema/transactionsSchema.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const TransactionController = {
  async getAllTransactions(ctx: Context) {
    try {
      const transactions = await TransactionService.findAll();
      ctx.response.status = 200;
      ctx.response.body = transactions;
    } catch (error) {
      console.error("Error in getAllTransactions method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async getTransactionById(ctx: CustomContext) {
    try {
      const transactionId = ctx.params.id;

      if (!transactionId) {
        ctx.response.status = 400;
        ctx.response.body = { error: "ID de la transaction manquant dans les paramètres de l'URL" };
        return;
      }

      const result = await TransactionService.findById(parseInt(transactionId));
      if (!result) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Transaction non trouvée" };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in getTransactionById method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },

  async createTransaction(ctx: Context) {
    try {
      const data: TransactionSchemaCreate = await ctx.request.body().value;
      const result = await TransactionService.create(data);
      ctx.response.status = 201;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error in createTransaction method:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  },
};

export default TransactionController;