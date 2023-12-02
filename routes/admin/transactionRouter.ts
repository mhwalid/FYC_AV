import { Router } from "../../deps.ts";
import TransactionController from "../../controllers/admin/transactionController.ts";

const transactionRouter = new Router();

transactionRouter.get("/", TransactionController.getAllTransactions);
transactionRouter.get("/users/:userId", TransactionController.getTransactionByUserId);

export default transactionRouter;
