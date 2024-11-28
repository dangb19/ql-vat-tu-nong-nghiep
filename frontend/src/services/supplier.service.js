import createApiClient from "./api.service";

class SupplierService {
  constructor(baseUrl = "http://localhost:3000/api/supplier") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(payload) {
    return (await this.api.post(`/`, payload)).data;
  }

  async update(id, payload) {
    return (await this.api.put(`/${id}`, payload)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}
export default new SupplierService();
