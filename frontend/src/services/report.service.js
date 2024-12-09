import createApiClient from "./api.service";

class ReportService {
  constructor(baseUrl = "http://localhost:3000/api/report") {
    this.api = createApiClient(baseUrl);
  }

  async getTotalRevenueProfit() {
    return (await this.api.get(`/total-revenue-profit`)).data;
  }
  async getTotalRevenueProfitByMonth(year) {
    return (await this.api.get(`/total-revenue-profit-by-month?year=${year}`))
      .data;
  }
}
export default new ReportService();
