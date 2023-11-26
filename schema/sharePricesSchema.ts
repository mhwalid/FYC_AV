import {TransactionSchema} from "./transactionsSchema.ts";

export interface SharePriceSchema {
  id: number;
  name: string;
  value: string;
  volume: string;
  createdAt: Date;
  updatedAt: Date;
  transaction: TransactionSchema[];
}

export interface SharePriceSchemaCreate {
  name: string;
  value: string;
  volume: string;
}

export interface SharePriceSchemaUpdate {
  id: number;
  name: string;
  value: string;
  volume: string;
}