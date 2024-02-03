import { Context } from "../../deps.ts";
import userLoginService from "../../services/user/userLoginService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

interface CustomContext extends Context {
  params: {
    [key: string]: string;
  };
}

const UserLoginController = {
  async getAllUserLogins(ctx: Context) {
    try {
      if (!checkHttpMethod(ctx, ["GET"])) {
        return;
      }

      const userLogins = await userLoginService.findAll();
      ctx.response.status = userLogins.httpCode;
      ctx.response.body = {
        success: userLogins.success,
        message: userLogins.message,
        userLogins: userLogins.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        userLogins: [],
      };
    }
  },

  async getUserLoginByUserId(ctx: CustomContext) {
    try {
      if (!checkHttpMethod(ctx, ["GET"])) {
        return;
      }

      const userId = ctx.params.userId;

      const userLogin = await userLoginService.findByUserId(Number(userId));
      ctx.response.status = userLogin.httpCode;
      ctx.response.body = {
        success: userLogin.success,
        message: userLogin.message,
        userLogin: userLogin.data,
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        message: error.message,
        userLogin: null,
      };
    }
  },
};

export default UserLoginController;
