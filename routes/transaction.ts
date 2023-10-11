import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import transactionController from "../controllers/transaction.ts";
import { validateJwtMiddleware } from "../middlewares/check-auth.ts";
const router = new Router();

router
    .get('/', (context) => {
        context.response.body = 'The server is alive! 🚀';
    })
    .get('/transaction/all', transactionController.getAllTransactions)
    .get("/transaction/:id", transactionController.getTransactionById)
    .post("/transaction/create", validateJwtMiddleware,  transactionController.createTransaction)



export default router;