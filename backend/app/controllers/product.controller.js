const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const ProductService = require("../services/product.service");

const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.create(req.body);

    return res.send(document);
  } catch (error) {
    console.log("error", error);

    return next(new ApiError(500, "An error occur while creating doc"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  const { sortField = "name", sortOrder = "asc", limit = 10 } = req.query;

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
