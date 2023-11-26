import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

import authRouter from "./routes/auth.ts";
import roleRouter from "./routes/role.ts";
import transactionRouter from "./routes/transaction.ts";
import sharePriceRouter from "./routes/shareprice.ts";
import userRouter from "./routes/user.ts";

const env = config();
const { PORT, HOSTNAME } = env;

const app = new Application();
const router = new Router();

router.use("/auth", authRouter.routes());
router.use("/role", roleRouter.routes());
router.use("/share-price", sharePriceRouter.routes());
router.use("/transaction", transactionRouter.routes());
router.use("/user", userRouter.routes());

app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https://" : "http://";
    const url = `${protocol}${hostname ?? "localhost"}:${port}`;
    console.log(`Listening on: ${url}`);
});

const port = parseInt(PORT) || 8080;
await app.listen({ port, hostname: HOSTNAME || "localhost" });
