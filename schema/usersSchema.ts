import {RoleSchema} from "./rolesSchema.ts"
import {TransactionSchema} from "./transactionsSchema.ts";

export interface UserSchema {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  account: number;
  isCdu: boolean;
  cduAcceptedAt: Date;
  registerAt: Date;
  updatedAt: Date;
  role: RoleSchema;
  transaction: TransactionSchema[];
}

export interface UserSchemaLogin {
  email: string;
  password: string;
}

export interface UserSchemaCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  account: number;
  isCdu: boolean;
  cduAcceptedAt: Date;
  roleId: number;
}

export interface UserSchemaRoleUpdate {
  id: number;
  roleId: number;
}

export interface UserSchemaInfoUpdate {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UserSchemaAccountUpdate {
  id: number;
  account: number;
}
