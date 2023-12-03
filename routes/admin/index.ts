import { Router } from "../../deps.ts"; // Importez le module Router depuis vos dépendances
import walletSharePriceRouter from "./walletSharePriceRouter.ts";
import roleRouter from "./roleRouter.ts";
import sharePriceRouter from "./sharePriceRouter.ts";
import transactionRouter from "./transactionRouter.ts";
import userLoginRouter from "./userLoginRouter.ts";
import userRouter from "./userRouter.ts";
import { validateAuthentificationMiddleware } from "../../middlewares/check-auth.ts";


const adminRouter = new Router();

adminRouter.use(validateAuthentificationMiddleware('ADMIN'));

adminRouter.use("/roles", roleRouter.routes());
adminRouter.use("/sharePrices", sharePriceRouter.routes());
adminRouter.use("/transactions", transactionRouter.routes());
adminRouter.use("/userLogins", userLoginRouter.routes());
adminRouter.use("/users", userRouter.routes());
adminRouter.use("/walletSharePrices", walletSharePriceRouter.routes());

export default adminRouter;