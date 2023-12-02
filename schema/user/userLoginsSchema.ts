import { UserSchema } from "./usersSchema.ts";

export interface UserLoginSchema {
  id: number;
  user: UserSchema;
  loginAt: Date;
}

export interface UserLoginSchemaCreate {
  userId: number;
}

