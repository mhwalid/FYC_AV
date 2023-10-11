import { Prisma, Role } from "../generated/client/deno/edge.ts";
import { PrismaClient } from "../generated/client/deno/edge.ts";
import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";

const envVars = await load();


const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envVars.DATABASE_URL,
    },
  },
});

export default {
    // make the crud with shareprice model 
    findAll: async() => {
        return await prisma.sharePrice.findMany();
    },
    findOne: async (id: string) => {
        return await prisma.sharePrice.findFirst({
            where: {
                id: id
            }
        })
    },
    create: async (sharePrice: Prisma.SharePriceCreateInput) => {
        const newSharePrice = await prisma.sharePrice.create({
            data: sharePrice
        })
        return newSharePrice
    },
    update: async (sharePrice: Prisma.SharePriceUpdateInput, id: string) => {
        return await prisma.sharePrice.update({
            where: {
                id: id
            },
            data: sharePrice
        })
    },
    delete: async (id: string) => {
        return await prisma.sharePrice.delete({
            where: {
                id: id
            }
        })
    }
}