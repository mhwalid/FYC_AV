import { Router } from "../../deps.ts";
import WalletSharePriceController from "../../controllers/app/walletSharePriceController.ts"

const walletSharePriceRouter = new Router();

walletSharePriceRouter.get("/users/:userId", WalletSharePriceController.findWalletSharePriceByUserId);
walletSharePriceRouter.get("/users/:userId/sharePrices/:sharePriceId", WalletSharePriceController.findUserSharePrice);

export default walletSharePriceRouter;
