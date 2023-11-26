import { Router } from "https://deno.land/x/oak/mod.ts";
import AuthController from "../controllers/authController.ts";

const router = new Router();

router
    .post("/register", AuthController.register)
    .post("/login", AuthController.login)


export default router;