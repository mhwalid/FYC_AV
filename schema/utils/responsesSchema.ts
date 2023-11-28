export interface FindResponse<T> {
  success: boolean;
  message: string;
  httpCode: number;
  data: T[];
}

export interface FindOneResponse<T> {
  success: boolean;
  message: string;
  httpCode: number;
  data: T | null;
}

export interface DeleteByIdResponse {
  success: boolean;
  message: string;
  httpCode: number;
}

export interface CreateResponse<T> {
  success: boolean;
  message: string;
  httpCode: number;
  info: CreateInfoResponse | T | null;
}

export interface UpdateByIdResponse<T> {
  success: boolean;
  message: string;
  httpCode: number;
  data: CreateInfoResponse | T | null;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  httpCode: number;
}

export interface CreateInfoResponse {
  lastInsertId: number,
  affectedRows: number
}