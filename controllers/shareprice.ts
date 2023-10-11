import sharePriceService from '../services/shareprice.ts';

export default {
    // make the controller crud with sharePriceService
    async getAllSharePrices({response}: {response: any}) {
        try {
            const sharePrices = await sharePriceService.findAll();
            response.body = sharePrices;
        } catch (error) {
            response.status = 500;
            response.body = {error: error.message};
        }
    },
    async getSharePriceById({response, params}: {response: any, params: {id: string}}) {
        try {
            const sharePrice = await sharePriceService.findOne(params.id);
            if (sharePrice) {
                response.body = sharePrice;
            } else {
                response.status = 404;
                response.body = {error: 'SharePrice not found'};
            }
        } catch (error) {
            response.status = 500;
            response.body = {error: error.message};
        }
    },
    async createSharePrice({request, response}: {request: any, response: any}) {
        const body = await request.body({type: 'json'});
        const requestBody = await body.value;
        try {
            const createdSharePrice = await sharePriceService.create(requestBody);
            response.status = 201;
            response.body = createdSharePrice;
        } catch (error) {
            response.status = 500;
            response.body = {error: error.message};
        }
    },
    async updateSharePriceById({params, response, request}: {params: {id: string}, request: any, response: any}) {
        try {
            const body = await request.body();
            const sharePrice = await body.value;
            const updatedSharePrice = await sharePriceService.update(sharePrice, params.id);
            response.body = updatedSharePrice;
        } catch (error) {
            response.status = 500;
            response.body = {error: error.message};
        }
    },
    async deleteSharePriceById({response, params}: {response: any, params: {id: string}}) {
        try {
            const sharePrice = await sharePriceService.findOne(params.id);
            if (!sharePrice) {
                response.status = 404;
                response.body = {error: 'SharePrice not found'};
                return;
            }
            await sharePriceService.delete(params.id);
            response.status = 200;
            response.body = {message: 'SharePrice deleted successfully'};
        } catch (error) {
            response.status = 500;
            response.body = {error: error.message};
        }
    }
}