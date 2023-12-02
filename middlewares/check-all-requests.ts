import { Context } from "../deps.ts";;

const RequestLimitMiddleware = (key: string, maxRequests: number, requestDuration: number) => {
  const requestCounts = new Map<string, number>();

  return async (ctx: Context, next: any) => {
    const ipAddress = ctx.request.ip

    const currentTimestamp = Date.now();
    const userAttempts = requestCounts.get(key + ipAddress) || 0;

    if (userAttempts >= maxRequests) {
      const lastRequestTimestamp = requestCounts.get(`${key + ipAddress}_lastAttempt`) || 0;
      if (currentTimestamp - lastRequestTimestamp < requestDuration) {
        ctx.response.status = 429;
        ctx.response.body = {
          success: false,
          message: "Trop de requêtes. Réessayez plus tard.",
        };
        return;
      } else {
        requestCounts.set(key + ipAddress, 0);
        requestCounts.set(`${key + ipAddress}_lastAttempt`, 0);
      }
    }

    requestCounts.set(key + ipAddress, userAttempts + 1);
    requestCounts.set(`${key + ipAddress}_lastAttempt`, currentTimestamp);

    await next();
  };
};

export default RequestLimitMiddleware;