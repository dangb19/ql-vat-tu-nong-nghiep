const AppService = require("./app.service");

class UserService extends AppService {
  constructor(client) {
    super(client, "user");
  }

  extractData(payload) {
    const user = {
      name: payload.name,
      email: payload.email,
      passwordHash: payload.passwordHash,
      role: payload.role,
      status: payload.status,
    };

    Object.keys(user).forEach((key) => {
      return user[key] === undefined && delete user[key];
    });

    return user;
  }

  async findByEmail(email) {
    return await this.Collection.findOne({ email });
  }
}

module.exports = UserService;
