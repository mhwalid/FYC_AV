import { Context } from "../deps.ts";

export default function checkHttpMethod(
  ctx: Context,
  allowedMethods: string[],
) {
  const method = ctx.request.method;
  if (!allowedMethods.includes(method)) {
    ctx.response.status = 405;
    ctx.response.body = {
      success: false,
      message: `Méthode : ${method} non autorisée pour cette route.`,
    };
    return false;
  }
  return true;
}
