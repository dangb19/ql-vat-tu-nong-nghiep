const { ObjectId, Double } = require("mongodb");
const ApiError = require("../api-error");
const ProductService = require("../services/product.service");
const ManufacturerService = require("../services/manufacturer.service");
const SupplierService = require("../services/supplier.service");
const CategoryService = require("../services/category.service");
const DiscountService = require("../services/discount.service");

const MongoDB = require("../utils/mongodb.util");

const convertToObjectId = (str) =>
  ObjectId.isValid(str) ? new ObjectId(str) : null;

exports.create = async (req, res, next) => {
  try {
    const productService = new ProductService(MongoDB.client);

    const product = {
      name: req.body.name,
      category: convertToObjectId(req.body.category),
      manufacturer: convertToObjectId(req.body.manufacturer),
      discount: convertToObjectId(req.body.discount) || "",
      price: new Double(req.body.price),
      stockQuantity: 0,
      imageUrls: req.body.imageUrls,
      description: req.body.description,
    };

    const document = await productService.create(
      productService.extractData(product)
    );

    return res.send(document);
  } catch (error) {
    console.log("error", error);

    return next(new ApiError(500, "An error occur while creating doc"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  const { sortField = "name", sortOrder = "asc", limit = 5 } = req.query;

  // Chuyển đổi sortOrder sang dạng số để dùng với MongoDB
  const sortOption = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  try {
    const productService = new ProductService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await productService.findByName(name);
    } else {
      documents = await productService.find({}, undefined, sortOption, limit);
    }
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving doc"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Doc not found!"));
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving doc with id=${req.params.id}`)
    );
  }
};

exports.getProductWithDetails = async (req, res, next) => {
  // Không sort, phân trang
  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.getProductWithDetails(
      ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null
    );
    if (!document) return next(new ApiError(404, "Doc not found!"));
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving doc with id=${req.params.id}`)
    );
  }
};

exports.getProducts = async (req, res, next) => {
  const {
    sortField = "name",
    sortOrder = "asc",
    page = 1,
    limit = 5,
    q = "",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Tạo điều kiện tìm kiếm
  const searchCriteria = q
    ? {
        $or: [{ name: { $regex: q, $options: "i" } }],
      }
    : {};

  // Tạo điều kiện sắp xếp
  const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  try {
    const productService = new ProductService(MongoDB.client);

    // Aggregation pipeline
    const pipeline = [
      // Match search criteria
      { $match: searchCriteria },
      // Lookup discount details
      {
        $lookup: {
          from: "discount", // Tên collection chứa thông tin giảm giá
          localField: "discount",
          foreignField: "_id",
          as: "discountInfo",
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
    const documents = await productService.Collection.aggregate(
      pipeline
    ).toArray();

    // Đếm tổng số bản ghi thỏa mãn điều kiện
    const total = await productService.Collection.countDocuments(
      searchCriteria
    );

    // Trả về dữ liệu và thông tin phân trang
    return res.send({
      products: documents,
      total,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving products")
    );
  }
};

exports.getProductInfo = async (req, res, next) => {
  let docsCate = [];
  let docsDisc = [];
  let docsManu = [];
  let docsSupp = [];

  try {
    const manufacturerService = new ManufacturerService(MongoDB.client);
    const supplierService = new SupplierService(MongoDB.client);
    const categoryService = new CategoryService(MongoDB.client);
    const discountService = new DiscountService(MongoDB.client);

    docsCate = await categoryService.find({});
    docsDisc = await discountService.find({});
    docsManu = await manufacturerService.find({});
    docsSupp = await supplierService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving docs"));
  }

  return res.send({
    manufacturers: docsManu,
    suppliers: docsSupp,
    categories: docsCate,
    discounts: docsDisc,
  });
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Doc to update can not be empty"));
  }

  try {
    const productService = new ProductService(MongoDB.client);

    const document = await productService.update(req.params.id, req.body);

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

exports.updateDiscount = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Doc to update can not be empty"));
  }

  try {
    const productService = new ProductService(MongoDB.client);

    const document = await productService.update(req.params.id, {
      discount: new ObjectId(req.body.discount),
    });

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

exports.removeDiscount = async (req, res, next) => {
  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.removeDiscount(req.params.id);

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
    const productService = new ProductService(MongoDB.client);
    const document = await productService.delete(req.params.id);
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

exports.countProductStats = async (req, res, next) => {
  try {
    const pipeline = [
      {
        $facet: {
          totalProducts: [{ $count: "count" }], // Đếm tổng số sản phẩm
          outOfStock: [
            { $match: { stockQuantity: 0 } },
            { $count: "count" }, // Đếm sản phẩm hết hàng
          ],
          lowStock: [
            { $match: { stockQuantity: { $gt: 0, $lt: 10 } } },
            { $count: "count" }, // Đếm sản phẩm sắp hết hàng
          ],
        },
      },
      {
        $project: {
          totalProducts: { $arrayElemAt: ["$totalProducts.count", 0] },
          outOfStock: { $arrayElemAt: ["$outOfStock.count", 0] },
          lowStock: { $arrayElemAt: ["$lowStock.count", 0] },
        },
      },
    ];

    const productService = new ProductService(MongoDB.client);

    const result = await productService.Collection.aggregate(
      pipeline
    ).toArray();

    return res.send(result[0]);
  } catch (error) {
    console.error("Error counting product stats:", error);
    throw error;
  }
};
