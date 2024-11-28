import createApiClient from "./api.service";

class UserService {
  constructor(baseUrl = "http://localhost:3000/api/user") {
    this.api = createApiClient(baseUrl);
  }
  async signup(payload) {
    return (await this.api.post("/signup", payload)).data;
  }
  async login(payload) {
    return (await this.api.post("/login", payload)).data;
  }
  async logout() {
    return (await this.api.get("/logout")).data;
  }
  async getProfile() {
    return (await this.api.get("/profile")).data;
  }
  async updateProfile(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // async getAll() {
  //   return (await this.api.get("/")).data;
  // }

  // async deleteAll() {
  //   return (await this.api.delete("/")).data;
  // }

  // async update(id, data) {
  //   return (await this.api.put(`/${id}`, data)).data;
  // }
  // async delete(id) {
  //   return (await this.api.delete(`/${id}`)).data;
  // }
}
export default new UserService();
