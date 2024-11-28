const AppService = require("./app.service");

class Inventory extends AppService {
  constructor(client) {
    super(client, "inventory");
  }

  extractData(payload) {
    const inventory = {
      product: payload.product,
      stockQuantity: payload.stockQuantity,
      warehouse: payload.warehouse,
      transactions: payload.transactions,
    };

    Object.keys(inventory).forEach((key) => {
      return inventory[key] === undefined && delete inventory[key];
    });

    return inventory;
  }
}

module.exports = Inventory;
