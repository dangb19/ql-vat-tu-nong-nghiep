const ApiError = require("../api-error");
const CategoryService = require("../services/category.service");

const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const document = await categoryService.create(req.body);

    return res.send(document);
  } catch (error) {
    console.log("error", error);

    return next(new ApiError(500, "An error occur while creating doc"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  const projection = { description: 0 };

  try {
    const categoryService = new CategoryService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await categoryService.findByName(name);
    } else {
      documents = await categoryService.find({}, projection);
    }
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving doc"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const document = await categoryService.findById(req.params.id);
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
    const categoryService = new CategoryService(MongoDB.client);

    const document = await categoryService.update(req.params.id, req.body);

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
    const categoryService = new CategoryService(MongoDB.client);
    const document = await categoryService.delete(req.params.id);
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
