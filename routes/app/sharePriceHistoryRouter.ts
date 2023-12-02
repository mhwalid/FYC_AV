import { Router } from "../../deps.ts";
import SharePriceHistoryController from "../../controllers/app/sharePriceHistoryController.ts";

const sharePriceHistoryRouter = new Router();

sharePriceHistoryRouter.get("/", SharePriceHistoryController.getAllSharePriceHistory);
sharePriceHistoryRouter.get("/sharePrices/:sharePriceId", SharePriceHistoryController.getSharePriceHistoryBySharePriceId);

export default sharePriceHistoryRouter;

