import { Router } from "../../deps.ts";
import UserController from "../../controllers/app/userController.ts";

const userRouter = new Router();

userRouter.get("/", UserController.getUserById);
userRouter.patch("/info", UserController.updateUserInfo);
userRouter.patch("/wallet", UserController.updateUserWallet);

export default userRouter;
