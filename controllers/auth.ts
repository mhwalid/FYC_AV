import authService from "../services/authService.ts";

export default{
    register: async ({ request, response }: { request: any; response: any }) => {
        const body = await request.body({ type: 'json' });
        const requestBody = await body.value;
        const userDb = await authService.findOne(requestBody);
        if(userDb){
            response.status = 409;
            response.body = {
                message: "email already registered"
            }
            return;
        }
        const user = await authService.register(requestBody);
        response.status = 200;
        response.body = user;
    },
    login: async ({ request, response }: { request: any; response: any }) => {
        const body = await request.body({ type: 'json' });
        const requestBody = await body.value;
        try {
            const jwt = await authService.login(requestBody);
            response.status = 200;
            response.body = {token: jwt};

        }catch(error){
            response.status = 404;
            response.body = {
                message: error.message
            }
        }
    }
}