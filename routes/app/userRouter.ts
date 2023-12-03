import { Router } from "../../deps.ts";
import UserController from "../../controllers/app/userController.ts";

const userRouter = new Router();

userRouter.get("/", UserController.getUserById);
userRouter.put("/info", UserController.updateUserInfo);
userRouter.put("/wallet", UserController.updateUserWallet);

export default userRouter;
