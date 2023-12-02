import { UserSchema } from "../user/usersSchema.ts";
import { SharePriceSchema } from "./sharePricesSchema.ts";

export interface WalletSharePriceSchema {
    id: number;
    volume: number;
    createdAt: Date;
    updatedAt: Date;
    sharePrice: SharePriceSchema
    user: UserSchema;
}

export interface WalletSharePriceSchemaCreate {
    volume: number;
    sharePriceId: number;
    userId: number;
}

export interface WalletSharePriceSchemaUpdate {
    id: number;
    volume: number;
}

