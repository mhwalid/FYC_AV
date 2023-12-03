export interface RegisterResponse {
    success: boolean,
    message: string,
    httpCode: number,
    jwtToken?: string,
    userId?: number,
    roleName?: string,
}

export interface LoginResponse {
    success: boolean,
    message: string,
    httpCode: number,
    jwtToken?: string;
    userId?: number
    roleName?: string,
}