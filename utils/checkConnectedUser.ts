import { Context } from "../deps.ts";
import CookiesHandler from "./cookiesHandler.ts";

export default async function getConnectedUser(ctx: Context) {
    const userId = Number(await CookiesHandler.getCookie(ctx, 'userId'))
    console.log(userId, ctx);


    if (userId === undefined) {
        ctx.response.status = 401;
        ctx.response.body = {
            success: false,
            message: "Vous n\'êtes pas connecté",
        };
        return false;
    }
    return userId;
}
