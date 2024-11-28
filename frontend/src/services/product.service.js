import createApiClient from "./api.service";

class ProductService {
  constructor(baseUrl = "http://localhost:3000/api/product") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(sort) {
    return (await this.api.get(`?sort=${sort}`)).data;
  }

  async getLimitAndSort(sortField, order, limit) {
    return (
      await this.api.get(
        `?sortField=${sortField}&sortOrder=${order}&limit=${limit}`
      )
    ).data;
  }
  async findByName(searchTerm) {
    return (await this.api.get(`/search?q=${searchTerm}`)).data;
  }

  async findByCategory(payload) {
    return (
      await this.api.get(
        `/category?category=${payload.category}&sort=${payload.sort}`
      )
    ).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, payload) {
    return (await this.api.put(`/${id}`, payload)).data;
  }
}
export default new ProductService();
