import { Router } from "https://deno.land/x/oak/mod.ts";
import RoleController from "../controllers/roleController.ts";

const router = new Router();

router
    .get('/all', RoleController.getAllRoles)
    .get("/:id", RoleController.getRoleById)
    .post("/create", RoleController.createRole)
    .put("/:id", RoleController.updateRole)
    .delete("/:id", RoleController.deleteRole)

export default router;