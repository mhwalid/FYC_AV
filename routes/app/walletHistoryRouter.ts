import { Router } from "../../deps.ts";
import WalletHistoryController from "../../controllers/app/walletHistoryController.ts"

const walletHistoryRouter = new Router();

walletHistoryRouter.get("/users", WalletHistoryController.findWalletHistoryByUserId);

export default walletHistoryRouter;
