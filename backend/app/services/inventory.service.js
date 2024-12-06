const AppService = require("./app.service");

class Inventory extends AppService {
  constructor(client) {
    super(client, "inventory");
  }

  extractData(payload) {
    const inventory = {
      product: payload.product,
      quantity: payload.quantity,
      createdBy: payload.createdBy,
      costPrice: payload.costPrice,
      date: payload.date,
      supplier: payload.supplier,
    };

    Object.keys(inventory).forEach((key) => {
      return inventory[key] === undefined && delete inventory[key];
    });

    return inventory;
  }
}

module.exports = Inventory;
