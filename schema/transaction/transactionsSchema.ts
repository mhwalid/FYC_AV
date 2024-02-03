export interface TransactionSchema {
  id: number;
  value: number;
  volume: number;
  typeTransaction: string;
  transactedAt: Date;
  userId: number;
  sharePriceHistoryId: number;
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
  sharePriceId: number;
}
