const ApiError = require("../api-error");
const DiscountService = require("../services/discount.service");

const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const discountService = new DiscountService(MongoDB.client);
    const document = await discountService.create(req.body);

    return res.send(document);
  } catch (error) {
    console.log("error", error);

    return next(new ApiError(500, "An error occur while creating doc"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const discountService = new DiscountService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await discountService.findByName(name);
    } else {
      documents = await discountService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving doc"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const discountService = new DiscountService(MongoDB.client);
    const document = await discountService.findById(req.params.id);
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
    const discountService = new DiscountService(MongoDB.client);

    const document = await discountService.update(req.params.id, req.body);

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
    const discountService = new DiscountService(MongoDB.client);
    const document = await discountService.delete(req.params.id);
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
