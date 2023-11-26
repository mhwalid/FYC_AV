import { Router } from "https://deno.land/x/oak/mod.ts";
import SharePriceController from "../controllers/sharePriceController.ts";

const router = new Router();

router
    .get('/all', SharePriceController.getAllSharePrices)
    .get("/:id", SharePriceController.getSharePriceById)
    .post("/create", SharePriceController.createSharePrice)
    .put("/:id", SharePriceController.updateSharePrice)
    .delete("/:id", SharePriceController.deleteSharePrice)

export default router;