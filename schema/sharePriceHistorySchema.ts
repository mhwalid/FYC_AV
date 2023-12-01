import { TransactionSchema } from "./transactionsSchema.ts";
import { SharePriceSchema } from "./sharePricesSchema.ts";

export interface SharePriceHistorySchema {
  id: number;
  oldValue: number;
  oldVolume: number;
  createdAt: Date;
  sharePrice: SharePriceSchema;
  transaction: TransactionSchema[];
}

export interface SharePriceHistorySchemaCreate {
  oldValue: number;
  oldVolume: number;
  sharePriceId: number;
}