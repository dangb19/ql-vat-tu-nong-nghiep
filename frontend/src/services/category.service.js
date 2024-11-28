import createApiClient from "./api.service";

class CategoryService {
  constructor(baseUrl = "http://localhost:3000/api/category") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
}
export default new CategoryService();
