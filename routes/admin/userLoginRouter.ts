import { Router } from "../../deps.ts";
import UserLoginController from "../../controllers/admin/userLoginController.ts";

const userLoginRouter = new Router();

userLoginRouter.get("/", UserLoginController.getAllUserLogins);
userLoginRouter.get("/users/:userId", UserLoginController.getUserLoginByUserId);

export default userLoginRouter;
