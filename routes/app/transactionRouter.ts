import { Router } from "../../deps.ts";
import TransactionController from "../../controllers/app/transactionController.ts";

const transactionRouter = new Router();

transactionRouter.get("/users", TransactionController.getTransactionByUserId);
transactionRouter.post("/buy", TransactionController.buySharePrice);
transactionRouter.post("/sell", TransactionController.sellSharePrice);

export default transactionRouter;
