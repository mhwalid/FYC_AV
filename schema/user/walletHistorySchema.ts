export interface WalletHistorySchema {
    id: number;
    value: number;
    operationType: string;
    createdAt: Date;
    userId: number;
}

export interface WalletHistorySchemaCreate {
    value: number;
    operationType: string;
    userId: number
}

