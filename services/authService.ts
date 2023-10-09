import { PrismaClient } from "../generated/client/deno/edge.ts";

import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import * as jwt from "https://deno.land/x/djwt/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.9.1/mod.ts";
import { key } from "../utils/apiKeys.ts";
import { Prisma, User } from "../generated/client/deno/edge.ts";

const prisma = new PrismaClient()
export default {
    register: async (user: Prisma.UserCreateInput) => {
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const createdUser = await prisma.user.create({
            data: {...user,
                password: hashedPassword
            }  // Stockez le mot de passe haché
        })
        return createdUser
    },
    findOne: async (user: Prisma.UserCreateInput) => {
        console.log(user)
        const foundUser = await prisma.user.findFirst({
            where: {
                email: user.email
            }
        })
        return foundUser
    },

    login: async (user: Prisma.UserCreateInput) => {
        const foundUser: any = await prisma.user.findFirst({
            where: {
              email: user.email,
            },
          });
        
          if (!foundUser) {
            throw new Error('Utilisateur non trouvé');
          }
        
          // Vérifie le mot de passe haché
          const passwordMatch = await bcrypt.compare(user.password as string, foundUser.password);
          if (!passwordMatch) {
            throw new Error('Mot de passe incorrect');
          }
        
          // Génére un jeton d'authentification
          const payload = { foundUserId: foundUser.id };
          const jwt =  await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
          return jwt;
      
}
}