const { Double } = require("mongodb");
const AppService = require("./app.service");

class Discount extends AppService {
  constructor(client) {
    super(client, "discount");
    this.createTTLIndex();
  }

  async createTTLIndex() {
    try {
      // Tạo TTL index trên trường `endDate` với expireAfterSeconds là 0
      await this.Collection.createIndex(
        { endDate: 1 }, // Tạo index tăng dần
        { expireAfterSeconds: 0 } // Xóa tài liệu ngay khi `endDate` đến
      );
    } catch (error) {
      console.error("Error creating TTL index:", error);
    }
  }

  extractData(payload) {
    const discount = {
      name: payload.name,
      description: payload.description,
      discountPercentage: new Double(payload.discountPercentage),
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
    };

    Object.keys(discount).forEach((key) => {
      return discount[key] === undefined && delete discount[key];
    });

    return discount;
  }
}

module.exports = Discount;
