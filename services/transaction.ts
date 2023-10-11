import { prisma } from "../server.ts";
import { Prisma } from "../generated/client/deno/edge.ts";
export default {
    // make the crud with transaction model here
    findAll: async () => {
        return await prisma.transaction.findMany();
    },
    findOne: async (id: string) => {
        return await prisma.transaction.findFirst({
            where: {
                id: id
            }
        })
    },
    create: async (transaction: Prisma.TransactionCreateInput, sharePriceId: string, userId: string) => {
        const newTransaction = await prisma.transaction.create({
            data: {
                volume: transaction.volume,
                typeTransaction: transaction.typeTransaction,
                sharePrice: {connect : {id: sharePriceId}},
                user: {connect : {id: userId}},
            }
        })
        return newTransaction
    },
}