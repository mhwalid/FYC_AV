import { Context } from "../deps.ts";

const CookiesHandler = {
  setCookie(ctx: Context, name: string, value: string, options?: any) {
    ctx.cookies.set(name, value, options);
  },
  getCookie(ctx: Context, name: string): Promise<string | undefined> {
    return ctx.cookies.get(name);
  },
  deleteCookie(ctx: Context, name: string) {
    ctx.cookies.delete(name);
  },

  deleteLoginCookies(ctx: Context) {
    CookiesHandler.deleteCookie(ctx, "token");
    CookiesHandler.deleteCookie(ctx, "role");
    CookiesHandler.deleteCookie(ctx, "userId");
  },

  setLoginCookies(ctx: Context, token: string, role: string, userId: number) {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 jour
    const expirationDate = new Date(Date.now() + oneDayInMilliseconds);

    const options = {
      httpOnly: true,
      expires: expirationDate, // 1 journée
    };

    if (token && role && userId) {
      CookiesHandler.setCookie(ctx, "token", token, options);
      CookiesHandler.setCookie(ctx, "role", role, options);
      CookiesHandler.setCookie(ctx, "userId", userId.toString(), options);
    }
  },
};

export default CookiesHandler;
