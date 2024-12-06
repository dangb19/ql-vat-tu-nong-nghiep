import createApiClient from "./api.service";

class ProductService {
  constructor(baseUrl = "http://localhost:3000/api/product") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(sort) {
    return (await this.api.get(`?sort=${sort}`)).data;
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

  async getProducts(sortField, sortOrder, page, limit, searchTerm) {
    let url = `?sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}&q=${searchTerm}`;

    return (await this.api.get(url)).data;
  }

  async getProductInfo() {
    return (await this.api.get(`/product-info`)).data;
  }

  async getProductStats() {
    return (await this.api.get(`/product-stats`)).data;
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
  async updateDiscount(id, payload) {
    return (await this.api.put(`/${id}/update-discount`, payload)).data;
  }
  async removeDiscount(id) {
    return (await this.api.put(`/${id}/remove-discount`)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}
export default new ProductService();
