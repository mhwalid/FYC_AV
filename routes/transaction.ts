import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import TransactionController from "../controllers/transactionController.ts";
import { validateJwtMiddleware } from "../middlewares/check-auth.ts";
const router = new Router();

router
    .get('/all', TransactionController.getAllTransactions)
    .get("/:id", TransactionController.getTransactionById)
    .post("/create", TransactionController.createTransaction)

export default router;