import { Router } from "https://deno.land/x/oak/mod.ts";
import UserController from "../controllers/userController.ts";

const router = new Router();

router
    .get('/all', UserController.getAllUsers)
    .get("/:id", UserController.getUserById)
    .post("/create", UserController.createUser)
    .put("/:id/info", UserController.updateUserInfo)
    .put("/:id/account", UserController.updateUserAccount)
    .put("/:id/role", UserController.updateUserRole)
    .delete("/:id", UserController.deleteUser)

export default router;