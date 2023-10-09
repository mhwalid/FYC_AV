import { Router } from "https://deno.land/x/oak/mod.ts";
import authController from "../controllers/auth.ts";

const router = new Router();

router
    .get('/', (context) => {
        context.response.body = 'The server is alive! 🚀';
    })
    .post("/auth/register", authController.register)
    // .post("/auth/login", todoController.createTodo)


export default router;