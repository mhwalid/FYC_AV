import { Router } from "../../deps.ts";
import WalletSharePriceController from "../../controllers/app/walletSharePriceController.ts";

const walletSharePriceRouter = new Router();

walletSharePriceRouter.get(
  "/users",
  WalletSharePriceController.findWalletSharePriceByUserId,
);
walletSharePriceRouter.get(
  "/users/sharePrices/:sharePriceId",
  WalletSharePriceController.findUserSharePrice,
);

export default walletSharePriceRouter;
