import { Context, type RouterMiddleware } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts";
import { key } from "../utils/apiKeys.ts";
// Middleware pour vérifier le token JWT
export const validateJwtMiddleware: RouterMiddleware<string> = async(ctx: Context, next: any) =>{
    const headers = ctx.request.headers;
    const authHeader = headers.get("Authorization");
  
    if (!authHeader) {
      ctx.response.status = 401;
      ctx.response.body = { error: "No authorization header" };
      return;
    }
  
    const jwt = authHeader.split(" ")[1];
  
    if (!jwt) {
      ctx.response.status = 401;
      ctx.response.body = { error: "No JWT" };
      return;
    }
  
    try {
      const jwtPayload = await verify(jwt, key);
      ctx.state.jwtPayload = jwtPayload;
      await next();
    } catch (error) {
      ctx.response.status = 401;
      ctx.response.body = { error: error.message };
      return;
    }
  }