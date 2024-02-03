import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "../../deps.ts";

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
  unsubscribeAt: Date | null;
  isActive: boolean;
  roleId: number;
}

export interface UserSchemaFindAllFilters {
  isActive?: boolean;
  roleId?: number;
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
  cduAcceptedAt?: Date;
  roleId: number;
}

// Sans validation
// export interface UserSchemaRegister {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   wallet: number;
//   isCdu: boolean;
//   cduAcceptedAt?: Date;
// }

// Avec validation
export class UserSchemaRegister {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  wallet: number;

  @IsNotEmpty()
  @IsBoolean()
  isCdu: boolean;

  @IsOptional()
  @IsDate()
  cduAcceptedAt?: Date;

  constructor(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    wallet: number;
    isCdu: boolean;
    cduAcceptedAt?: Date;
  }) {
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.email = userData.email;
    this.password = userData.password;
    this.wallet = userData.wallet;
    this.isCdu = userData.isCdu;
    this.cduAcceptedAt = userData.cduAcceptedAt;
  }
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
  isActive: boolean;
}
