import createApiClient from "./api.service";

class OrderService {
  constructor(baseUrl = "http://localhost:3000/api/order") {
    this.api = createApiClient(baseUrl);
  }
}
export default new OrderService();
