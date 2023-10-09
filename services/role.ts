import { Prisma, Role } from "../generated/client/deno/edge.ts";
import { PrismaClient } from "../generated/client/deno/edge.ts";
const prisma = new PrismaClient()
export default {
    findAll: async() => {
        return await prisma.role.findMany()
    },
    findOne: async (id: number) => {
        return await prisma.role.findFirst({
            where: {
                id: id
            }
        })
    },
    create: async (role: Prisma.RoleCreateInput) => {
        return await prisma.role.create({
            data: role
        })
    },

    updateByID: async (role: Prisma.RoleUpdateInput, id: number) => {
        return await prisma.role.update({
            where: {
                id: id
            },
            data: role
        })
    },
    deleteByID: async (id: number) => {
        return await prisma.role.delete({
            where: {
                id: id
            }
        })
    }
    

}
    
