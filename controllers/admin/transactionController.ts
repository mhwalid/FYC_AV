import { Context } from "../../deps.ts";;
import transactionService from "../../services/transaction/transactionService.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";


interface CustomContext extends Context {
    params: {
        [key: string]: string;
    };
}

const TransactionController = {
    async getAllTransactions(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const transactions = await transactionService.findAll();
            ctx.response.status = transactions.httpCode;
            ctx.response.body = {
                success: transactions.success,
                message: transactions.message,
                transactions: transactions.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                transactions: [],
            };
        }
    },

    async getTransactionByUserId(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const userId = ctx.params.userId;

            const transaction = await transactionService.findByUserId(Number(userId));
            ctx.response.status = transaction.httpCode;
            ctx.response.body = {
                success: transaction.success,
                message: transaction.message,
                transaction: transaction.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                transaction: null,
            };
        }
    },
};

export default TransactionController;
