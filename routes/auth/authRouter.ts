import { Router } from "../../deps.ts";
import AuthController from "../../controllers/auth/authController.ts";
import RequestLimitMiddleware from "../../middlewares/check-all-requests.ts";

const authRouter = new Router();

const maxRequests = 10; // Nombre maximal de requêtes autorisées
const requestDuration = 60 * 1000; // Durée de la fenêtre de requêtes en millisecondes (1 minute)
// Création du middleware avec les paramètres personnalisés
const requestLimitMiddleware = RequestLimitMiddleware(
  "auth",
  maxRequests,
  requestDuration,
);

authRouter.use(async (ctx, next) => {
  await requestLimitMiddleware(ctx, next);
});

authRouter
  .post("/register", AuthController.register)
  .post("/login", AuthController.login)
  .get("/logout", AuthController.logout)
  .get("/:userId/unsubscribe", AuthController.unsubscribe);

export default authRouter;
