import { Router } from "../../deps.ts";
import AuthController from "../../controllers/auth/authController.ts";

const authRouter = new Router();

authRouter
  .post("/register", AuthController.register)
  .post("/login", AuthController.login)
  .get("/logout", AuthController.logout)
  .get("/:userId/unsubscribe", AuthController.unsubscribe)


export default authRouter;