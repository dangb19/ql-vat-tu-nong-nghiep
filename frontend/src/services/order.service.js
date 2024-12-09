import createApiClient from "./api.service";

class OrderService {
  constructor(baseUrl = "http://localhost:3000/api/order") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async getOrders() {
    return (await this.api.get("/")).data;
  }

  async getOrders2(sortField, sortOrder, page, limit, searchTerm) {
    let url = `?sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}&q=${searchTerm}`;

    return (await this.api.get(url)).data;
  }

  async getOrderInfo() {
    return (await this.api.get(`/order-info`)).data;
  }
  async getTopSellingProducts() {
    return (await this.api.get(`/top-selling`)).data;
  }
  async getTopCustomers() {
    return (await this.api.get(`/top-customers`)).data;
  }

  async getOrdersByCustomer(customerId) {
    return (await this.api.get(`/customer-orders/${customerId}`)).data;
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
export default new OrderService();
