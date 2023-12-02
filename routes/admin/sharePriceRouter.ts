import { Router } from "../../deps.ts";
import SharePriceController from "../../controllers/admin/sharePriceController.ts";

const sharePriceRouter = new Router();

sharePriceRouter.post("/", SharePriceController.createSharePrice);

export default sharePriceRouter;
