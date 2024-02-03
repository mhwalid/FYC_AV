import { ValidationError } from "../../deps.ts";

export interface RegisterResponse {
  success: boolean;
  message: string;
  httpCode: number;
  jwtToken?: string;
  userId?: number;
  roleName?: string;
  errors?: ValidationError[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  httpCode: number;
  jwtToken?: string;
  userId?: number;
  roleName?: string;
}
