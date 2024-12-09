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
    const productCollection = MongoDB.client
      .db("ql-vat-tu-nong-nghiep")
      .collection("product");
    const counterCollection = MongoDB.client
      .db("ql-vat-tu-nong-nghiep")
      .collection("counter");

    // Tạo mã đơn hàng
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const sequenceDoc = await counterCollection.findOneAndUpdate(
      { _id: today }, // Dựa theo ngày
      { $inc: { seq: 1 } }, // Tăng sequence
      { upsert: true, returnDocument: "after" }
    );

    const sequence = sequenceDoc.seq.toString().padStart(3, "0"); // Định dạng 3 chữ số
    const orderCode = `ORD-${today}-${sequence}`;

    const order = {
      customer: convertToObjectId(req.body.customer),
      date: new Date(new Date().setFullYear(2024, 8, 14)),
      totalAmount: new Double(req.body.totalAmount),
      orderCode,
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

        const updateResult = await productCollection.updateOne(
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

    return res.send("Created order successfully!");
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

  // Tạo điều kiện sắp xếp
  const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  try {
    const orderService = new OrderService(MongoDB.client);

    // Sử dụng aggregation để ánh xạ thông tin khách hàng và người tạo
    const pipeline = [
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

      // Giải nén mảng customerInfo (nếu chỉ lấy 1 khách hàng)
      { $unwind: { path: "$customerInfo", preserveNullAndEmptyArrays: true } },

      // Giải nén mảng createdByInfo (nếu chỉ lấy 1 người tạo)
      { $unwind: { path: "$createdByInfo", preserveNullAndEmptyArrays: true } },

      // Áp dụng tiêu chí tìm kiếm (nếu có)
      ...(q
        ? [
            {
              $match: {
                $or: [
                  { "customerInfo.name": { $regex: q, $options: "i" } },
                  { "createdByInfo.name": { $regex: q, $options: "i" } },
                ],
              },
            },
          ]
        : []),

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

    // Đếm tổng số bản ghi thỏa mãn điều kiện (sau khi áp dụng pipeline)
    const totalPipeline = [
      ...pipeline.slice(0, -3), // Bỏ các bước phân trang và chọn trường
      { $count: "total" },
    ];

    const totalResult = await orderService.Collection.aggregate(
      totalPipeline
    ).toArray();
    const total = totalResult[0]?.total || 0;

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

exports.getOrdersByCustomer = async (req, res, next) => {
  const { customerId } = req.params; // Lấy customerId từ URL
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  try {
    const orderService = new OrderService(MongoDB.client);

    const orders = await orderService.Collection.find({
      customer: new ObjectId(customerId),
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const total = await orderService.Collection.countDocuments({
      customer: new ObjectId(customerId),
    });

    return res.send({
      orders,
      total,
    });
  } catch (error) {
    console.error("Error retrieving orders by customer:", error);
    return next(new ApiError(500, "An error occurred while retrieving orders"));
  }
};

exports.getTopSellingProducts = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);

    const pipeline = [
      { $unwind: "$orderDetails" },

      // Nhóm theo productId và tính tổng số lượng
      {
        $group: {
          _id: "$orderDetails.productId", // Nhóm theo productId
          productName: { $first: "$orderDetails.productName" }, // Lấy tên sản phẩm
          productImage: { $first: "$orderDetails.productImage" }, // Lấy ảnh sản phẩm
          totalQuantity: { $sum: "$orderDetails.quantity" }, // Tính tổng số lượng
        },
      },

      { $sort: { totalQuantity: -1 } },

      { $limit: 10 },
    ];

    const topProducts = await orderService.Collection.aggregate(
      pipeline
    ).toArray();

    return res.send(topProducts);
  } catch (error) {
    console.error("Error retrieving top-selling products:", error);
    return next(
      new ApiError(
        500,
        "An error occurred while retrieving top-selling products"
      )
    );
  }
};

exports.getTopCustomers = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);

    const pipeline = [
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },

      { $limit: 10 },
      {
        $lookup: {
          from: "customer", // Collection khách hàng
          localField: "_id", // ID của khách hàng trong order
          foreignField: "_id", // ID của khách hàng trong customer
          as: "customerInfo",
        },
      },

      { $unwind: "$customerInfo" },

      {
        $project: {
          _id: 1,
          totalSpent: 1,
          orderCount: 1,
          "customerInfo.name": 1,
          "customerInfo.email": 1,
          "customerInfo.phone": 1,
        },
      },
    ];

    const topCustomers = await orderService.Collection.aggregate(
      pipeline
    ).toArray();

    return res.send(topCustomers);
  } catch (error) {
    console.error("Error retrieving top customers:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving top customers")
    );
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);
    const document = await orderService.Collection.aggregate([
      {
        $match: { _id: new ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "customer",
          localField: "customer",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdByInfo",
        },
      },
      {
        $project: {
          _id: 1,
          orderCode: 1,
          customerInfo: 1,
          date: 1,
          totalAmount: 1,
          status: 1,
          createdByInfo: 1,
          orderDetails: 1,
        },
      },
    ]).toArray();

    if (!document) return next(new ApiError(404, "Doc not found!"));
    return res.json(document[0]);
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
