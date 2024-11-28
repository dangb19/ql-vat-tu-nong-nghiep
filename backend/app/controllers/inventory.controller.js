const ApiError = require("../api-error");
const InventoryService = require("../services/inventory.service");

const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const inventoryService = new InventoryService(MongoDB.client);
    const document = await inventoryService.create(req.body);

    return res.send(document);
  } catch (error) {
    console.log("error", error);

    return next(new ApiError(500, "An error occur while creating doc"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const inventoryService = new InventoryService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await inventoryService.findByName(name);
    } else {
      documents = await inventoryService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving doc"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const inventoryService = new InventoryService(MongoDB.client);
    const document = await inventoryService.findById(req.params.id);
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
    const inventoryService = new InventoryService(MongoDB.client);

    const document = await inventoryService.update(req.params.id, req.body);

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
    const inventoryService = new InventoryService(MongoDB.client);
    const document = await inventoryService.delete(req.params.id);
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

exports.getInventories = async (req, res, next) => {
  const {
    sortField = "name",
    sortOrder = "asc",
    page = 1,
    limit = 10,
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
    const inventoryService = new InventoryService(MongoDB.client);

    // Aggregation pipeline
    const pipeline = [
      // Match search criteria
      { $match: searchCriteria },
      // Lookup discount details
      {
        $lookup: {
          from: "product",
          localField: "product",
          foreignField: "_id",
          as: "productInfo",
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
        $lookup: {
          from: "supplier",
          localField: "supplier",
          foreignField: "_id",
          as: "supplierInfo",
        },
      },
      {
        $project: {
          date: 1,
          quantity: 1,
          totalCost: 1,
          "productInfo.name": 1,
          "createdByInfo.name": 1,
          "supplierInfo.name": 1,
        },
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limitNum },
    ];

    const documents = await inventoryService.Collection.aggregate(
      pipeline
    ).toArray();

    const total = await inventoryService.Collection.countDocuments(
      searchCriteria
    );

    return res.send({
      inventories: documents,
      total,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving products")
    );
  }
};
