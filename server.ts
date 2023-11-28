import { Application, Router, oakCors, config } from "./deps.ts";

import authRouter from "./routes/auth.ts";
import roleRouter from "./routes/role.ts";
import transactionRouter from "./routes/transaction.ts";
import sharePriceRouter from "./routes/shareprice.ts";
import userRouter from "./routes/user.ts";

import RequestLimitMiddleware from "./middlewares/check-all-requests.ts"

const env = config();
const { PORT, HOSTNAME } = env;

const app = new Application();
const router = new Router();

const maxRequests = 100; // Nombre maximal de requêtes autorisées
const requestDuration = 60 * 1000; // Durée de la fenêtre de requêtes en millisecondes (1 minute)
// Création du middleware avec les paramètres personnalisés
const requestLimitMiddleware = RequestLimitMiddleware("server", maxRequests, requestDuration);
app.use(requestLimitMiddleware);

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
