import { Router } from "../../deps.ts";
import SharePriceController from "../../controllers/app/sharePriceController.ts";

const sharePriceRouter = new Router();

sharePriceRouter.get("/", SharePriceController.getAllSharePrices);
sharePriceRouter.get("/:sharePriceId", SharePriceController.getSharePriceById);

export default sharePriceRouter;
