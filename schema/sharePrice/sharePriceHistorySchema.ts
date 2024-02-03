export interface SharePriceHistorySchema {
  id: number;
  oldValue: number;
  oldVolume: number;
  createdAt: Date;
  sharePriceId: number;
}

export interface SharePriceHistorySchemaCreate {
  oldValue: number;
  oldVolume: number;
  sharePriceId: number;
}
