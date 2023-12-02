import { Router } from "../../deps.ts"; // Importez le module Router depuis vos dépendances
import walletSharePriceRouter from "./walletSharePriceRouter.ts";
import roleRouter from "./roleRouter.ts";
import sharePriceRouter from "./sharePriceRouter.ts";
import transactionRouter from "./transactionRouter.ts";
import userLoginRouter from "./userLoginRouter.ts";
import userRouter from "./userRouter.ts";

const adminRouter = new Router();

adminRouter.use("/roles", roleRouter.routes());
adminRouter.use("/share-prices", sharePriceRouter.routes());
adminRouter.use("/transactions", transactionRouter.routes());
adminRouter.use("/userLogins", userLoginRouter.routes());
adminRouter.use("/users", userRouter.routes());
adminRouter.use("/walletSharePrices", walletSharePriceRouter.routes());

export default adminRouter;