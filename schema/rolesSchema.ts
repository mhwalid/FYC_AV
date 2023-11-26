import {UserSchema} from "./usersSchema.ts";

export interface RoleSchema {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserSchema[];
}

export interface RoleSchemaCreate {
  name: string;
}
  
export interface RoleSchemaUpdate {
  id: number
  name: string;
}
