const { ObjectId } = require("mongodb");
const AppService = require("./app.service");

class Product extends AppService {
  constructor(client) {
    super(client, "product");
  }

  async removeDiscount(id) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const result = await this.Collection.findOneAndUpdate(filter, {
      $unset: { discount: "" },
    });

    return result;
  }

  async getProductWithDetails(productId) {
    const product = await this.Collection.aggregate([
      { $match: { _id: productId } },
      {
        $lookup: {
          from: "category", // Tên collection 'category'
          localField: "category", // Trường 'category' trong sản phẩm
          foreignField: "_id", // Trường '_id' trong collection 'category'
          as: "categoryInfo", // Kết quả join sẽ được lưu vào trường 'categoryInfo'
        },
      },
      {
        $lookup: {
          from: "manufacturer",
          localField: "manufacturer",
          foreignField: "_id",
          as: "manufacturerInfo",
        },
      },
      {
        $lookup: {
          from: "discount",
          localField: "discount",
          foreignField: "_id",
          as: "discountInfo",
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          costPrice: 1,
          stockQuantity: 1,
          description: 1,
          categoryInfo: { _id: 1, name: 1 }, // Chỉ lấy tên category
          manufacturerInfo: { _id: 1, name: 1 }, // Chỉ lấy tên manufacturer
          discountInfo: { _id: 1, name: 1, discountPercentage: 1 }, // Chỉ lấy số tiền giảm giá
          imageUrls: 1,
        },
      },
    ]).toArray();

    return product[0]; // Trả về sản phẩm với thông tin chi tiết
  }
}

module.exports = Product;
