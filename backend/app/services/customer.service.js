const AppService = require("./app.service");

class CustomerService extends AppService {
  constructor(client) {
    super(client, "customer");
  }

  extractData(payload) {
    const customer = {
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
      orders: payload.orders,
    };

    Object.keys(customer).forEach((key) => {
      return customer[key] === undefined && delete customer[key];
    });

    return customer;
  }
}

module.exports = CustomerService;
