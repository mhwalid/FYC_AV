import {TransactionSchema} from "./transactionsSchema.ts";

export interface SharePriceSchema {
  id: number;
  name: number;
  value: number;
  volume: string;
  createdAt: Date;
  updatedAt: Date;
  transaction: TransactionSchema[];
}

export interface SharePriceSchemaCreate {
  name: string;
  value: number;
  volume: number;
}

export interface SharePriceSchemaUpdate {
  id: number;
  name: string;
  value: number;
  volume: number;
}