export interface UserLoginSchema {
  id: number;
  userId: number;
  loginAt: Date;
}

export interface UserLoginSchemaCreate {
  userId: number;
}

