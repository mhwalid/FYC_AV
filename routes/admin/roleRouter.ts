import { Router } from "../../deps.ts";
import RoleController from "../../controllers/admin/roleController.ts";

const roleRouter = new Router();

roleRouter.get("/", RoleController.getAllRoles);
roleRouter.post("/", RoleController.createRole);
roleRouter.patch("/:roleId", RoleController.updateRole);
roleRouter.delete("/:roleId", RoleController.deleteRole);

export default roleRouter;
