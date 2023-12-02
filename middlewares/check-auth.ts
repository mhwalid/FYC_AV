import { Context, verify, type RouterMiddleware } from "../deps.ts";;
import { key } from "../utils/apiKeys.ts";
// Middleware pour vérifier le token JWT
export const validateJwtMiddleware: RouterMiddleware<string> = async (ctx: Context, next: any) => {
  // const headers = ctx.request.headers;
  // const authHeader = headers.get("Authorization");

  // if (!authHeader) {
  //   ctx.response.status = 401;
  //   ctx.response.body = { error: "No authorization header" };
  //   return;
  // }

  // const jwt = authHeader.split(" ")[1];


  const token = await ctx.cookies.get('token');

  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = { error: "No JWT" };
    return;
  }

  try {
    const jwtPayload = await verify(token, key);
    // Vérifier si le token a expiré
    const actualTimeStampUnix = Math.floor(Date.now() / 1000)
    if (jwtPayload.exp && jwtPayload.exp < actualTimeStampUnix) {
      ctx.response.status = 401;
      ctx.response.body = { error: 'Token expired' };
      return;
    }

    ctx.state.jwtPayload = jwtPayload;
    await next();
  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = { error: error.message };
    return;
  }
}