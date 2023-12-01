import { RoleSchema } from "./rolesSchema.ts"
import { TransactionSchema } from "./transactionsSchema.ts";
import { WalletHistorySchema } from "./walletHistorySchema.ts";
import { UserLoginSchema } from "./userLoginsSchema.ts";

export interface UserSchema {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  wallet: number;
  isCdu: boolean;
  cduAcceptedAt: Date;
  registerAt: Date;
  updatedAt: Date;
  unsubscribeAt: Date;
  isActive: boolean;
  role: RoleSchema;
  transactions: TransactionSchema[];
  walletHistories: WalletHistorySchema[];
  userLogins: UserLoginSchema[];
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
  wallet: number;
  isCdu: boolean;
  isActive: boolean;
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

export interface UserSchemaWalletUpdate {
  id: number;
  value: number;
}

export interface UserSchemaActiveUpdate {
  id: number;
  isActive: number;
}
