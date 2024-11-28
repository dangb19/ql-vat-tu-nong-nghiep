const AppService = require("./app.service");

class OrderDetail extends AppService {
  constructor(client) {
    super(client, "order_detail");
  }

  extractData(payload) {
    const order_detail = {
      product: payload.product,
      quantity: payload.quantity,
      subtotal: payload.subtotal,
    };

    Object.keys(order_detail).forEach((key) => {
      return order_detail[key] === undefined && delete order_detail[key];
    });

    return order_detail;
  }
}

module.exports = OrderDetail;
