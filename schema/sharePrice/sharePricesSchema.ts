export interface SharePriceSchema {
  id: number;
  name: string;
  value: number;
  volume: number;
  createdAt: Date;
  updatedAt: Date;
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

export interface UpdateByIdSharePriceResponse {
  success: boolean;
  message: string;
  httpCode: number;
  data: SharePriceSchema | null;
  sharePriceHistoryId: number | null;
}