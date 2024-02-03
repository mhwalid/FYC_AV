import { Application, config, oakCors, Router } from "./deps.ts";
import appRouter from "./routes/app/index.ts";
import adminRouter from "./routes/admin/index.ts";
import authRouter from "./routes/auth/authRouter.ts";
import RequestLimitMiddleware from "./middlewares/check-all-requests.ts";

const env = config();
const { PORT, HOSTNAME } = env;

const app = new Application();
const router = new Router();

const maxRequests = 100; // Nombre maximal de requêtes autorisées
const requestDuration = 60 * 1000; // Durée de la fenêtre de requêtes en millisecondes (1 minute)const listener = Deno.listen({ hostname: "localhost", port: 8080 });

// Création du middleware avec les paramètres personnalisés
const requestLimitMiddleware = RequestLimitMiddleware(
  "server",
  maxRequests,
  requestDuration,
);
app.use(requestLimitMiddleware);

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
