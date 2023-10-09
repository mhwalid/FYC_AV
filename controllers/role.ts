import roleService from "../services/role.ts";


export default {
  async getAllRoles({response}: {response: any}) {
    try {
      const roles = await roleService.findAll();
      response.body = roles;
    } catch (error) {
      response.status = 500;
      response.body = { error: "Internal server error" };
    }
  },

  async getRoleById({response, params}: {response: any, params: {id: string}}) {
    try {
      const id = parseInt(params.id);
      const role = await roleService.findOne(id);
      if (role) {
        response.body = role;
      } else {
        response.status = 404;
        response.body = { error: "Role not found" };
      }
    } catch (error) {
      response.status = 500;
      response.body = { error: "Internal server error" };
    }
  },

  async createRole({ request, response }: { request: any; response: any }) {
    try {
      const role = await request.body().value;
      const createdRole = await roleService.create(role);
     response.status = 201;
     response.body = createdRole;
    } catch (error) {
     response.status = 500;
     response.body = { error: "Internal server error" };
    }
  },

  async updateRoleById({params, response, request}: {params:{id:string}, request:any, response:any}) {
    try {
      const id = parseInt(params.id);
      const role = await request.body().value;
      const updatedRole = await roleService.updateByID(role, id);
      response.body = updatedRole;
    } catch (error) {
      response.status = 500;
      response.body = { error: "Internal server error" };
    }
  },

  async deleteRoleById({ response, params }: { response: any, params: { id: string } }) {
    try {
      const id = parseInt(params.id);
      await roleService.deleteByID(id);
      response.status = 204;
    } catch (error) {
      response.status = 500;
      response.body = { error: "Internal server error" };
    }
  },
};