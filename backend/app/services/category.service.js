const AppService = require("./app.service");

class Category extends AppService {
  constructor(client) {
    super(client, "category");
  }

  extractData(payload) {
    const category = {
      name: payload.name,
      description: payload.description,
    };

    Object.keys(category).forEach((key) => {
      return category[key] === undefined && delete category[key];
    });

    return category;
  }
}

module.exports = Category;
