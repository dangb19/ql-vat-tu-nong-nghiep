const AppService = require("./app.service");

class Supplier extends AppService {
  constructor(client) {
    super(client, "category");
  }

  extractData(payload) {
    const supplier = {
      name: payload.name,
      description: payload.description,
    };

    Object.keys(supplier).forEach((key) => {
      return supplier[key] === undefined && delete supplier[key];
    });

    return supplier;
  }
}

module.exports = Supplier;
