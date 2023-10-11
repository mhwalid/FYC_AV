import transactionService from '../services/transaction.ts';
import { Context } from "https://deno.land/x/oak/mod.ts";
export default {
    //make the crud with transactionService
    async getAllTransactions({response}: {response: any}) {
        try {
            const transactions = await transactionService.findAll();
            response.body = transactions;
        } catch (error) {
            response.status = 500;
            response.body = {error: error.message};
        }
    },
    async getTransactionById({response, params}: {response: any, params: {id: string}}) {
        try {
            const transaction = await transactionService.findOne(params.id);
            if (transaction) {
                response.body = transaction;
            } else {
                response.status = 404;
                response.body = {error: 'Transaction not found'};
            }
        } catch (error) {
            response.status = 500;
            response.body = {error: error.message};
        }
    },
    async createTransaction(ctx: Context) {
        const body = await ctx.request.body({type: 'json'});
        const requestBody = await body.value;
        try {
            requestBody.user = ctx.state.jwtPayload.payload.foundUserId
            const createdTransaction = await transactionService.create(requestBody, requestBody.sharePriceId, requestBody.user);
            ctx.response.status = 201;
            ctx.response.body = createdTransaction;
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {error: error.message};
        }
    },
}