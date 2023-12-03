export interface WalletSharePriceSchema {
    id: number;
    volume: number;
    createdAt: Date;
    updatedAt: Date;
    sharePriceId: number
    userId: number;
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

