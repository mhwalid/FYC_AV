import { assertEquals } from "https://deno.land/std@0.212.0/assert/mod.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";
import RoleController from "../../../controllers/admin/roleController.ts";
import roleService from "../../../services/user/roleService.ts";
import { DeleteByIdResponse, FindOneResponse } from "../../../schema/utils/responsesSchema.ts";
import { RoleSchema } from "../../../schema/user/rolesSchema.ts";

interface CustomContext extends Context {
    params: {
        [key: string]: string;
    };
}

Deno.test("La suppression d'un rôle se passe correctement - 200", async () => {
    const roleId = "1";
    const ctx = {
        params: { roleId },
        request: {
            method: 'DELETE',
        },
        response: {
            status: 0,
            body: {},
        },
    } as unknown as CustomContext;

    // Créer un mock pour le service
    const mockRoleService = {
        deleteById: async (_roleId: number) => {
            return {
                httpCode: 200,
                success: true,
                message: "Role deleted successfully",
            } as unknown as DeleteByIdResponse;
        },
    };

    // Remplacez la méthode réelle par le mock
    const originalRoleService = Object.assign({}, roleService);

    roleService.deleteById = mockRoleService.deleteById;

    await RoleController.deleteRole(ctx);

    // Test assertions
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, {
        success: true,
        message: "Role deleted successfully",
    });

    // Rétablissez la méthode réelle après le test
    roleService.deleteById = originalRoleService.deleteById;
});

Deno.test("La suppression d'un rôle échoue si le rôle est utilisé par un utilisateur - 400", async () => {
    const roleId = 1;
    const ctx = {
        params: { roleId },
        request: {
            method: 'DELETE',
        },
        response: {
            status: 0,
            body: {},
        },
    } as unknown as CustomContext;

    // Créer un mock pour le service
    const mockRoleService = {
        findById: async (_id: number) => {
            return {
                success: true,
                message: "Rôle récupèré avec succès",
                httpCode: 200,
            } as unknown as FindOneResponse<RoleSchema>;
        },

        isRoleInUse: async (_id: number) => {
            return true;
        },
    };

    // Remplacez la méthode réelle par le mock
    const originalRoleService = Object.assign({}, roleService);
    roleService.isRoleInUse = mockRoleService.isRoleInUse;
    roleService.findById = mockRoleService.findById;

    await RoleController.deleteRole(ctx);

    // Test assertions
    //assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, {
        success: false,
        message: "Erreur lors de la suppression du rôle. Il est utilisé par au moins utilisateur",
    });

    // Rétablissez la méthode réelle après le test
    roleService.isRoleInUse = originalRoleService.isRoleInUse;
    roleService.findById = originalRoleService.findById;
});

Deno.test("La suppression d'un rôle échoue si le rôle n'existe pas - 404", async () => {
    const roleId = 1;
    const ctx = {
        params: { roleId },
        request: {
            method: 'DELETE',
        },
        response: {
            status: 0,
            body: {},
        },
    } as unknown as CustomContext;

    // Créer un mock pour le service
    const mockRoleService = {
        findById: async (_id: number) => {
            return {
                success: false,
                message: "Le rôle n'existe pas",
                httpCode: 404,
            } as unknown as FindOneResponse<RoleSchema>;
        },
    };

    // Remplacez la méthode réelle par le mock
    const originalRoleService = Object.assign({}, roleService);
    roleService.findById = mockRoleService.findById;


    await RoleController.deleteRole(ctx);

    // Test assertions
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, {
        success: false,
        message: "Le rôle n'existe pas",
    });

    // Rétablissez la méthode réelle après le test
    roleService.findById = originalRoleService.findById;
});