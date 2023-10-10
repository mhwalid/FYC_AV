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
    findAll: async() => {
        return await prisma.role.findMany()
    },
    findOne: async (id: string) => {
        return await prisma.role.findFirst({
            where: {
                id: id
            }
        })
    },
    create: async (role: Prisma.RoleCreateInput) => {
        const newRole = await prisma.role.create({
            data: role
        })
        console.log("role", newRole)
        return newRole
    },

    updateByID: async (role: Prisma.RoleUpdateInput, id: string) => {
        return await prisma.role.update({
            where: {
                id: id
            },
            data: role
        })
    },
    deleteByID: async (id: string) => {
        return await prisma.role.delete({
            where: {
                id: id
            }
        })
    }
    

}
    
