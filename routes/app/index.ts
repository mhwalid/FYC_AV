import { Router } from "../../deps.ts"; // Importez le module Router depuis vos dépendances
import walletHistoryRouter from "../app/walletHistoryRouter.ts";
import sharePriceHistoryRouter from "./sharePriceHistoryRouter.ts";
import sharePriceRouter from "./sharePriceRouter.ts";
import transactionRouter from "./transactionRouter.ts";
import userRouter from "./userRouter.ts";
import walletSharePriceRouter from "./walletSharePriceRouter.ts";

const appRouter = new Router();

appRouter.use("/sharePriceHistories", sharePriceHistoryRouter.routes());
appRouter.use("/share-prices", sharePriceRouter.routes());
appRouter.use("/transactions", transactionRouter.routes());
appRouter.use("/users", userRouter.routes());
appRouter.use("/walletHistories", walletHistoryRouter.routes());
appRouter.use("/walletSharePrices", walletSharePriceRouter.routes());

export default appRouter;