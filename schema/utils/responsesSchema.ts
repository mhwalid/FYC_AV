export interface FindResponse<T> {
  success: boolean;
  message: string;
  httpCode: number;
  data: T[] | null;
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
  info: InfoResponse | T | null;
}

export interface UpdateByIdResponse<T> {
  success: boolean;
  message: string;
  httpCode: number;
  data: InfoResponse | T | null;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  httpCode: number;
}

export interface InfoResponse {
  lastInsertId: number,
  affectedRows: number
}