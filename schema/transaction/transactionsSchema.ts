import { UserSchema } from "../user/usersSchema.ts";
import { SharePriceHistorySchema } from "../sharePrice/sharePriceHistorySchema.ts";

export interface TransactionSchema {
  id: number;
  value: number;
  volume: number;
  typeTransaction: string;
  transactedAt: Date;
  user: UserSchema;
  sharePriceHistory: SharePriceHistorySchema;
}

export interface TransactionSchemaCreate {
  volume: number;
  value: number;
  typeTransaction: string;
  userId: number;
  sharePriceHistoryId: number;
}

export interface RequestTransactionSchemaCreate {
  volume: number;
  userId: number;
  sharePriceId: number;
}
