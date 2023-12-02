import { Router } from "../../deps.ts";
import UserController from "../../controllers/app/userController.ts";

const userRouter = new Router();

userRouter.get("/:userId", UserController.getUserById);
userRouter.put("/:userId/info", UserController.updateUserInfo);
userRouter.put("/:userId/wallet", UserController.updateUserWallet);

export default userRouter;
