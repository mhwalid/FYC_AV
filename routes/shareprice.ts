import { Router } from "https://deno.land/x/oak/mod.ts";
import sharePriceController from "../controllers/shareprice.ts";

const router = new Router();

router
    .get('/', (context) => {
        context.response.body = 'The server is alive! 🚀';
    })
    .get('/shareprice/all', sharePriceController.getAllSharePrices)
    .get("/shareprice/:id", sharePriceController.getSharePriceById)
    .post("/shareprice/create", sharePriceController.createSharePrice)
    .put("/shareprice/:id", sharePriceController.updateSharePriceById)
    .delete("/shareprice/:id", sharePriceController.deleteSharePriceById)
    
    // .post("/auth/login", todoController.createTodo)


export default router;