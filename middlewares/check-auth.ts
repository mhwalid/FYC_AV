import { Context, verify, type RouterMiddleware } from "../deps.ts";;
import { getKey } from "../utils/keyManager.ts";
import CookiesHandler from "../utils/cookiesHandler.ts";

export const validateAuthentificationMiddleware: (role: string) => RouterMiddleware<string> = (role) => {
  return async (ctx: Context, next: any) => {
    const token = await CookiesHandler.getCookie(ctx, 'token');
    const userRole = await CookiesHandler.getCookie(ctx, 'role');

    if (token === undefined || userRole === undefined) {
      ctx.response.status = 401;
      ctx.response.body = { error: 'Vous n\'êtes pas connecté' };
      return;
    }

    if (userRole !== role) {
      ctx.response.status = 403;
      ctx.response.body = { error: 'Vous n\'avez pas l\'autorisation d\'accéder à cette ressource' };
      return;
    }

    try {
      // Vérifier si le token a expiré
      const jwtPayload = await verify(token, await getKey());

      const actualTimeStampUnix = Math.floor(Date.now() / 1000)
      if (jwtPayload.exp && jwtPayload.exp < actualTimeStampUnix) {
        ctx.response.status = 401;
        ctx.response.body = { error: 'Votre session a expiré, merci de vous reconnecter' };
        return;
      }

      ctx.state.jwtPayload = jwtPayload;
      await next();
    } catch (error) {
      ctx.response.status = 401;
      ctx.response.body = { error: error.message };
      return;
    }
  };
};
