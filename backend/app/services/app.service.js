const { ObjectId } = require("mongodb");

class AppService {
  constructor(client, collection) {
    this.Collection = client.db().collection(collection);
  }

  extractData(payload) {
    Object.keys(payload).forEach((key) => {
      return payload[key] === undefined && delete payload[key];
    });

    return payload;
  }

  async create(payload) {
    const reader = this.extractData(payload);
    const result = await this.Collection.insertOne(reader);

    return result;
  }

  async find(filter = {}, projection = {}, sortOption = {}, limit) {
    const cursor = await this.Collection.find(filter, {
      projection,
    })
      .sort(sortOption)
      .limit(Number(limit || 0));
    return await cursor.toArray();
  }

  async findByName(name, projection = {}) {
    return await this.find(
      {
        name: { $regex: name, $options: "i" },
      },
      { projection }
    );
  }

  async findById(id, projection = {}) {
    return await this.Collection.findOne(
      {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      },
      { projection }
    );
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractData(payload);
    const result = await this.Collection.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async delete(id) {
    const result = await this.Collection.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = AppService;
