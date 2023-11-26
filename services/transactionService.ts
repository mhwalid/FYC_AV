import dbClient from "../database.connectDB.ts";
import { TransactionSchema, TransactionSchemaCreate } from "../schema/transactionsSchema.ts";

interface FindByIdResponse {
  transaction: TransactionSchema | null;
}

interface DeleteByIdResponse {
  success: boolean;
}

interface CreateResponse {
  success: boolean;
}

interface UpdateByIdResponse {
  success: boolean;
}

const TransactionService = {
  findAll: async (): Promise<TransactionSchema[]> => {
    try {
      const result = await dbClient.query(`SELECT * FROM transactions`);
      return result as TransactionSchema[];
    } catch (error) {
      throw new Error(`Error while fetching all transactions: ${error.message}`);
    }
  },
  findById: async (id: number): Promise<TransactionSchema | null> => {
    try {
      const result = await dbClient.query("SELECT * FROM transactions WHERE id = ?", [id]);
      return result.length > 0 ? result[0] as TransactionSchema : null as null;
    } catch (error) {
      throw new Error(`Error while fetching transaction by Id: ${error.message}`);
    }
  },
  create: async (data: TransactionSchemaCreate): Promise<CreateResponse> => {
    try {
      await dbClient.query(
        "INSERT INTO transactions (volume, typeTransaction, transactedAt, user_id, sharePrice_id) VALUES (?, ?, NOW(), ?, ?)",
        [data.volume, data.typeTransaction, data.user.id, data.sharePrice.id]
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Error while creating transaction: ${error.message}`);
    }
  },
};

export default TransactionService;