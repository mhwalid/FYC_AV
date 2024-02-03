import { Router } from "../../deps.ts";
import UserController from "../../controllers/admin/userController.ts";

const userRouter = new Router();

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:userId", UserController.getUserById);
userRouter.post("/", UserController.createUser);
userRouter.patch("/:userId/active", UserController.updateActiveUser);
userRouter.patch("/:userId/roles", UserController.updateUserRole);

export default userRouter;
