import { UserSchema } from "./usersSchema.ts";

export interface WalletHistorySchema {
    id: number;
    value: number;
    operationType: string;
    createdAt: Date;
    user: UserSchema;
}

export interface WalletHistorySchemaCreate {
    value: number;
    operationType: string;
    userId: number
}

