import createApiClient from "./api.service";

class CustomerService {
  constructor(baseUrl = "http://localhost:3000/api/inventory") {
    this.api = createApiClient(baseUrl);
  }

  async getInventories(sortField, sortOrder, page, limit, searchTerm) {
    let url = `?sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}&q=${searchTerm}`;

    return (await this.api.get(url)).data;
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
export default new CustomerService();
