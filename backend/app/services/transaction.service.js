const AppService = require("./app.service");

class Transaction extends AppService {
  constructor(client) {
    super(client, "transaction");
  }

  extractData(payload) {
    const transaction = {
      inventory: payload.inventory,
      type: payload.type,
      quantity: payload.quantity,
      note: payload.note,
      date: payload.date,
      createdBy: payload.createdBy,
    };

    Object.keys(transaction).forEach((key) => {
      return transaction[key] === undefined && delete transaction[key];
    });

    return transaction;
  }
}

module.exports = Transaction;
