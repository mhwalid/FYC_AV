import dbClient from "../database.connectDB.ts";
import { SharePriceSchema, SharePriceSchemaCreate, SharePriceSchemaUpdate } from "../schema/sharePricesSchema.ts";

interface DeleteByIdResponse {
  success: boolean;
}

interface CreateResponse {
  success: boolean;
}

interface UpdateByIdResponse {
  success: boolean;
}

const SharePriceService = {
  findAll: async (): Promise<SharePriceSchema[]> => {
    try {
      const result = await dbClient.query(`SELECT * FROM share_prices`);
      return result as SharePriceSchema[];
    } catch (error) {
      throw new Error(`Error while fetching all share prices: ${error.message}`);
    }
  },
  findById: async (id: number): Promise<SharePriceSchema | null> => {
    try {
        const result = await dbClient.query("SELECT * FROM share_prices WHERE id = ?", [id]);
        return result.length > 0 ? result[0] as SharePriceSchema : null as null;
    } catch (error) {
      throw new Error(`Error while fetching share price by Id: ${error.message}`);
    }
    },
    checkIfNomExists: async (name: string): Promise<boolean> => {
        try {
          const existingSharePriceQuery = `SELECT * FROM share_prices WHERE name = ?`;
          const existingSharePrice = await dbClient.query(existingSharePriceQuery, [name]);
          
          return existingSharePrice.length > 0;
        } catch (error) {
          throw new Error(`Error while checking share price name existence: ${error.message}`);
        }
      },
  deleteById: async (id: number): Promise<DeleteByIdResponse> => {
    try {
      await dbClient.query("DELETE FROM share_prices WHERE id = ?", [id]);
      return { success: true };
    } catch (error) {
      throw new Error(`Error while deleting share price by Id: ${error.message}`);
    }
  },
  create: async (data: SharePriceSchemaCreate): Promise<CreateResponse> => {
    try {
      await dbClient.query(
        "INSERT INTO share_prices (name, value, volume, createdAt) VALUES (?, ?, ?, NOW())",
        [data.name, data.value, data.volume]
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Error while creating share price: ${error.message}`);
    }
  },
  updateById: async (data: SharePriceSchemaUpdate): Promise<UpdateByIdResponse> => {
    try {
        await dbClient.query(
          "UPDATE share_prices SET name = ?, value = ?, volume = ?, updatedAt = NOW() WHERE id = ?",
          [data.name, data.value, data.volume, data.id]
        );

        return { success: true };
    } catch (error) {
      throw new Error(`Error while updating share price by Id: ${error.message}`);
    }
  },
};

export default SharePriceService;