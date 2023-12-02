export interface RegisterResponse {
    success: boolean,
    message: string,
    httpCode: number,
    jwtToken: string | undefined;
}

export interface LoginResponse {
    jwtToken: string | undefined;
    success: boolean,
    message: string,
    httpCode: number,
    userId: number | undefined
}

export interface LogoutResponse {
    success: boolean,
    message: string,
    httpCode: number
}