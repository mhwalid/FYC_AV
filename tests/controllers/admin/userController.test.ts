// userController.test.ts
import { assertEquals } from "https://deno.land/std@0.212.0/assert/mod.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";
import UserController from "../../../controllers/admin/userController.ts";
import userService from "../../../services/user/userService.ts";
import { UserSchemaFindAllFilters, UserSchema, UserSchemaCreate, UserSchemaActiveUpdate } from "../../../schema/user/usersSchema.ts";
import { FindResponse, FindOneResponse, CreateResponse, UpdateByIdResponse } from "../../../schema/utils/responsesSchema.ts";

interface CustomContext extends Context {
    params: {
        [key: string]: string;
    };
}

Deno.test("La récupérations des utilisateurs ce passent correctement", async () => {
    const ctx = {
        request: {
            url: new URL("http://example.com/api/users?isActive=true&roleId=1"),
            method: 'GET'
        },
        response: {
            status: 0,
            body: {},
        },
    } as unknown as Context;

    // Créer un mock pour le service
    const mockUserService = {
        findAll: async (_filters?: UserSchemaFindAllFilters) => {
            return {
                httpCode: 200,
                success: true,
                message: "Users found successfully",
                data: [
                    { id: 1, name: "User 1", isActive: true, roleId: 1 },
                    { id: 2, name: "User 2", isActive: true, roleId: 1 },
                ],
            } as unknown as FindResponse<UserSchema>;
        },
    };

    // Remplacez la méthode réelle par le mock
    const originalUserService = Object.assign({}, userService);
    userService.findAll = mockUserService.findAll;

    await UserController.getAllUsers(ctx);

    // Test assertions
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, {
        success: true,
        message: "Users found successfully",
        users: [
            { id: 1, name: "User 1", isActive: true, roleId: 1 },
            { id: 2, name: "User 2", isActive: true, roleId: 1 },
        ],
    });

    // Rétablissez la méthode réelle après le test
    userService.findAll = originalUserService.findAll;
});

Deno.test("La récupération d'un utilisateur ce passe correctement", async () => {
    const userId = "1";
    const ctx = {
        params: { userId },
        request: {
            url: new URL(`http://example.com/api/users/${userId}`),
            method: 'GET'
        },
        response: {
            status: 0,
            body: {},
        },
    } as unknown as CustomContext;

    // Créer un mock pour le service
    const mockUserService = {
        findById: async (_userId: number) => {
            return {
                httpCode: 200,
                success: true,
                message: "User found successfully",
                data: {
                    id: 1,
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    password: "hashedpassword",
                    wallet: 1000,
                    isCdu: true,
                    cduAcceptedAt: new Date(),
                    registerAt: new Date(),
                    updatedAt: new Date(),
                    unsubscribeAt: null,
                    isActive: true,
                    roleId: 1,
                } as UserSchema,
            } as unknown as FindOneResponse<UserSchema>;
        },
    };

    // Remplacez la méthode réelle par le mock
    const originalUserService = Object.assign({}, userService);
    userService.findById = mockUserService.findById;

    await UserController.getUserById(ctx);

    // Test assertions
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, {
        success: true,
        message: "User found successfully",
        user: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "hashedpassword",
            wallet: 1000,
            isCdu: true,
            cduAcceptedAt: new Date(),
            registerAt: new Date(),
            updatedAt: new Date(),
            unsubscribeAt: null,
            isActive: true,
            roleId: 1,
        },
    });

    // Rétablissez la méthode réelle après le test
    userService.findById = originalUserService.findById;
});

Deno.test("La création d'un utilisateur ce passe correctement", async () => {
    const ctx = {
        request: {
            hasBody: true,
            method: 'POST',
            body: () => ({
                value: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    password: "password123",
                    wallet: 1000,
                    isCdu: true,
                    cduAcceptedAt: new Date(),
                    roleId: 1,
                } as UserSchemaCreate,
            }),
        },
        response: {
            status: 0,
            body: {},
        },
    } as unknown as Context;

    // Créer un mock pour le service
    const mockUserService = {
        create: async (_userData: UserSchemaCreate) => {
            return {
                success: true,
                message: "Utilisateur créé avec succès",
                httpCode: 201,
                info: {
                    lastInsertId: 1,
                    affectedRows: 1,
                },
            } as unknown as CreateResponse<UserSchema>;
        },
    };

    // Remplacez la méthode réelle par le mock
    const originalUserService = Object.assign({}, userService);
    userService.create = mockUserService.create;

    await UserController.createUser(ctx);

    // Test assertions
    assertEquals(ctx.response.status, 201); // Code de création réussie
    assertEquals(ctx.response.body, {
        success: true,
        message: "Utilisateur créé avec succès",
        user: {
            lastInsertId: 1,
            affectedRows: 1,
        },
    });

    // Rétablissez la méthode réelle après le test
    userService.create = originalUserService.create;
});

Deno.test("La mise à jour de l'activité d'un utilisateur ce passe correctement", async () => {
    const ctx = {
        request: {
            hasBody: true,
            method: 'PATCH',
            body: () => ({
                value: {
                    id: 1,
                    isActive: false,
                } as UserSchemaActiveUpdate,
            }),
        },
        response: {
            status: 0,
            body: {},
        },
    } as unknown as Context;

    // Créer un mock pour le service
    const mockUserService = {
        findById: async (_userId: number) => {
            return {
                success: true,
                message: "Utilisateur trouvé avec succès",
                httpCode: 200,
                data: {
                    id: 1,
                    isActive: true,
                },
            } as unknown as FindOneResponse<UserSchema>;
        },
        updateUserIsActive: async (_data: UserSchemaActiveUpdate) => {
            return {
                success: true,
                message: "Activité de l'utilisateur mise à jour avec succès",
                httpCode: 200,
                data: {
                    lastInsertId: 1,
                    affectedRows: 1,
                },
            } as unknown as UpdateByIdResponse<UserSchema>;
        },
    };

    // Remplacez la méthode réelle par le mock
    const originalUserService = Object.assign({}, userService);
    userService.findById = mockUserService.findById;
    userService.updateUserIsActive = mockUserService.updateUserIsActive;

    await UserController.updateActiveUser(ctx);

    // Test assertions
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, {
        success: true,
        message: "Activité de l'utilisateur mise à jour avec succès",
        data: {
            lastInsertId: 1,
            affectedRows: 1,
        },
    });

    // Rétablissez la méthode réelle après le test
    userService.findById = originalUserService.findById;
    userService.updateUserIsActive = originalUserService.updateUserIsActive;
});

