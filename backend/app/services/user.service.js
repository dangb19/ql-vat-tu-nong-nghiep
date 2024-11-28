const { ObjectId } = require("mongodb");
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

  async toggleStatus(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      // role: { $ne: "admin" },    // Chỉ được vô hiệu nếu user không phải admin
    };
    const update = this.extractData(payload);
    const result = await this.Collection.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async findByEmail(email) {
    return await this.Collection.findOne({ email });
  }
}

module.exports = UserService;
