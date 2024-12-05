const ApiError = require("../api-error");
const OrderService = require("../services/order.service");
const CustomerService = require("../services/customer.service");
const ProductService = require("../services/product.service");
const UserService = require("../services/user.service");

const MongoDB = require("../utils/mongodb.util");
const { ObjectId, Double } = require("mongodb");

const convertToObjectId = (str) =>
  ObjectId.isValid(str) ? new ObjectId(str) : null;

//  Create order with stock update
exports.create = async (req, res, next) => {
  try {
    const session = MongoDB.client.startSession();
    const orderService = new OrderService(MongoDB.client);
    const productService = new ProductService(MongoDB.client);
    const productsCollection = MongoDB.client
      .db("ql-vat-tu-nong-nghiep")
      .collection("product");

    const order = {
      customer: convertToObjectId(req.body.customer),
      date: new Date(),
      totalAmount: new Double(req.body.totalAmount),
      status: "pending",
      createdBy: convertToObjectId(req.body.createdBy),
      orderDetails: req.body.orderDetails,
    };
    const newOrder = {
      ...order,
      orderDetails: order.orderDetails.map((ord) => {
        return {
          ...ord,
          productId: convertToObjectId(ord.productId),
          price: new Double(ord.price),
          subtotal: new Double(ord.subtotal),
        };
      }),
    };

    await session.withTransaction(async () => {
      // 1. Tạo đơn hàng
      await orderService.create(newOrder);

      // 2. Cập nhật stockQuantity của từng sản phẩm
      for (const item of order.orderDetails) {
        const { productId, quantity } = item;

        const updateResult = await productsCollection.updateOne(
          {
            _id: convertToObjectId(productId),
            stockQuantity: { $gte: quantity },
          }, // Kiểm tra đủ hàng
          { $inc: { stockQuantity: -quantity } }, // Giảm số lượng trong kho
          { session }
        );

        if (updateResult.matchedCount === 0) {
          throw new Error(`Insufficient stock for product ${productId}`);
        }
      }
    });

    return res.send("Created order success!");
  } catch (error) {
    console.error("Transaction aborted: ", error);

    return next(new ApiError(500, "An error occur while creating doc"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const orderService = new OrderService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await orderService.findByName(name);
    } else {
      documents = await orderService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving doc"));
  }

  return res.send(documents);
};

exports.getOrders = async (req, res, next) => {
  const {
    sortField = "date",
    sortOrder = "desc",
    page = 1,
    limit = 10,
    q = "",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Tạo điều kiện tìm kiếm
  const searchCriteria = {};

  // Tạo điều kiện sắp xếp
  const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  try {
    const orderService = new OrderService(MongoDB.client);

    // Sử dụng aggregation để ánh xạ thông tin khách hàng và người tạo
    const pipeline = [
      // Áp dụng tiêu chí tìm kiếm
      { $match: searchCriteria },

      // Lookup thông tin khách hàng
      {
        $lookup: {
          from: "customer", // Tên collection khách hàng
          localField: "customer", // Trường trong orders
          foreignField: "_id", // Trường trong customers
          as: "customerInfo", // Kết quả lưu vào customerInfo
        },
      },

      // Lookup thông tin người tạo đơn hàng
      {
        $lookup: {
          from: "user", // Tên collection người dùng
          localField: "createdBy", // Trường trong orders
          foreignField: "_id", // Trường trong users
          as: "createdByInfo", // Kết quả lưu vào createdByInfo
        },
      },

      // Sắp xếp
      { $sort: sortOptions },

      // Phân trang
      { $skip: skip },
      { $limit: limitNum },

      // Chỉ chọn các trường cần thiết
      {
        $project: {
          _id: 1,

          "customerInfo.name": 1,
          date: 1,
          totalAmount: 1,
          status: 1,
          "createdByInfo.name": 1,
        },
      },
    ];

    // Thực hiện pipeline
    const documents = await orderService.Collection.aggregate(
      pipeline
    ).toArray();

    // Đếm tổng số bản ghi thỏa mãn điều kiện
    const total = await orderService.Collection.countDocuments(searchCriteria);

    // Trả về dữ liệu và thông tin phân trang
    return res.send({
      orders: documents,
      total,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return next(new ApiError(500, "An error occurred while retrieving orders"));
  }
};

exports.getOrders2 = async (req, res, next) => {
  const {
    sortField = "date",
    sortOrder = "desc",
    page = 1,
    limit = 10,
    q = "",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Tạo điều kiện tìm kiếm
  const searchCriteria = {
    $or: [{ status: { $regex: "pending", $options: "i" } }],
  };

  // Tạo điều kiện sắp xếp
  const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  try {
    const orderService = new OrderService(MongoDB.client);

    // Aggregation pipeline
    const pipeline = [
      // Match search criteria
      { $match: searchCriteria },
      // Lookup discount details
      {
        $lookup: {
          from: "customer", // Tên collection chứa thông tin giảm giá
          localField: "customer",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      // Sort theo sortOptions
      { $sort: sortOptions },
      // Skip để phân trang
      { $skip: skip },
      // Limit để phân trang
      { $limit: limitNum },
    ];

    // Lấy dữ liệu sản phẩm
    const documents = await orderService.Collection.aggregate(
      pipeline
    ).toArray();

    // Đếm tổng số bản ghi thỏa mãn điều kiện
    const total = await orderService.Collection.countDocuments(searchCriteria);

    // Trả về dữ liệu và thông tin phân trang
    return res.send({
      orders: documents,
      total,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving products")
    );
  }
};

exports.getOrderInfo = async (req, res, next) => {
  let customers = [];
  let users = [];

  try {
    const customerService = new CustomerService(MongoDB.client);
    const userService = new UserService(MongoDB.client);

    customers = await customerService.find({});
    users = await userService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving docs"));
  }

  return res.send({
    customers,
    users,
  });
};

exports.findOne = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);
    const document = await orderService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Doc not found!"));
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving doc with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Doc to update can not be empty"));
  }

  try {
    const orderService = new OrderService(MongoDB.client);

    const document = await orderService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Doc not found!"));
    }
    return res.send({ message: "Doc was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating doc with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);
    const document = await orderService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Doc not found!"));
    }
    return res.send({ message: "Doc was deleted successfully!" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete doc with id=${req.params.id}`)
    );
  }
};
