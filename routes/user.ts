import { Router } from "https://deno.land/x/oak/mod.ts";
import UserController from "../controllers/userController.ts";

const router = new Router();

router
    .get('/all', UserController.getAllUsers)
    .get("/:id", UserController.getUserById)
    .post("/create", UserController.createUser)
    .put("/info/:id", UserController.updateUserInfo)
    .put("/account/:id", UserController.updateUserAccount)
    .put("/role/:id", UserController.updateUserRole)
    .delete("/:id", UserController.deleteUser)

export default router;