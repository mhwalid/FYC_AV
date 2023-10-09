import { Router } from "https://deno.land/x/oak/mod.ts";
import roleController from "../controllers/role.ts";

const router = new Router();

router
    .get('/', (context) => {
        context.response.body = 'The server is alive! 🚀';
    })
    .get('/role/all', roleController.getAllRoles)
    .get("/role/:id", roleController.getRoleById)
    .post("/role/create", roleController.createRole)
    .put("/role/:id", roleController.updateRoleById)
    .delete("/role/:id", roleController.deleteRoleById)
    
    // .post("/auth/login", todoController.createTodo)


export default router;