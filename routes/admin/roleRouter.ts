import { Router } from "../../deps.ts";
import RoleController from "../../controllers/admin/roleController.ts";

const roleRouter = new Router();

roleRouter.get("/", RoleController.getAllRoles);
roleRouter.post("/", RoleController.createRole);
roleRouter.put("/:roleId", RoleController.updateRole);
roleRouter.put("/users/:roleId", RoleController.updateUserRole);
roleRouter.delete("/:roleId", RoleController.deleteRole);

export default roleRouter;
