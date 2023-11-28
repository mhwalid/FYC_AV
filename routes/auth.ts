import { Router } from "../deps.ts";
import AuthController from "../controllers/authController.ts";
import RequestLimitMiddleware from "../middlewares/check-all-requests.ts"

const router = new Router();

const maxRequests = 10; // Nombre maximal de requêtes autorisées
const requestDuration = 60 * 1000; // Durée de la fenêtre de requêtes en millisecondes (1 minute)
// Création du middleware avec les paramètres personnalisés
const requestLimitMiddleware = RequestLimitMiddleware("auth", maxRequests, requestDuration);

router.use(async (ctx, next) => {
    await requestLimitMiddleware(ctx, next);
  });

router
    .post("/register", AuthController.register)
    .post("/login", AuthController.login)


export default router;