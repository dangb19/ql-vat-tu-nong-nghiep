const AppService = require("./app.service");

class Supplier extends AppService {
  constructor(client) {
    super(client, "supplier");
  }

  extractData(payload) {
    const supplier = {
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
      email: payload.email,
    };

    Object.keys(supplier).forEach((key) => {
      return supplier[key] === undefined && delete supplier[key];
    });

    return supplier;
  }

  async findByPhone(phoneNumber) {
    return await this.Collection.findOne({ phoneNumber });
  }
}

module.exports = Supplier;
