const AppService = require("./app.service");

class Order extends AppService {
  constructor(client) {
    super(client, "order");
  }

  extractData(payload) {
    const order = {
      orderCode: payload.orderCode,
      customer: payload.customer,
      date: payload.date,
      totalAmount: payload.totalAmount,
      status: payload.status,
      createdBy: payload.createdBy,
      orderDetails: payload.orderDetails,
    };

    Object.keys(order).forEach((key) => {
      return order[key] === undefined && delete order[key];
    });

    return order;
  }
}

module.exports = Order;
