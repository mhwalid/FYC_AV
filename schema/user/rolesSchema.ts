export interface RoleSchema {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleSchemaCreate {
  name: string;
}

export interface RoleSchemaUpdate {
  id: number;
  name: string;
}
