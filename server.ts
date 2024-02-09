import { Application, Router, oakCors, config } from "./deps.ts";
import appRouter from "./routes/app/index.ts";
import adminRouter from "./routes/admin/index.ts";
import authRouter from "./routes/auth/authRouter.ts";

const env = config();
const { PORT, HOSTNAME } = env;

const app = new Application();
const router = new Router();

// Utilisation des routers
router.use("/app", appRouter.routes());
router.use("/auth", authRouter.routes());
router.use("/admin", adminRouter.routes());

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
