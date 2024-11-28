const ApiError = require("../api-error");
const CustomerService = require("../services/customer.service");

const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const customerService = new CustomerService(MongoDB.client);
    const document = await customerService.create(req.body);

    return res.send(document);
  } catch (error) {
    console.log("error", error);

    return next(new ApiError(500, "An error occur while creating user"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const customerService = new CustomerService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await customerService.findByName(name);
    } else {
      documents = await customerService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving user"));
  }

  return res.send(documents);
};

exports.getCustomers = async (req, res, next) => {
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
        $or: [
          { name: { $regex: q, $options: "i" } },
          { phoneNumber: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  // Tạo điều kiện sắp xếp
  const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  try {
    const customerService = new CustomerService(MongoDB.client);

    // Lấy dữ liệu khách hàng
    const documents = await customerService.Collection.find(searchCriteria)
      .skip(skip)
      .limit(limitNum)
      .sort(sortOptions)
      .toArray();

    // Đếm tổng số bản ghi thỏa mãn điều kiện
    const total = await customerService.Collection.countDocuments(
      searchCriteria
    );

    // Trả về dữ liệu và thông tin phân trang
    return res.send({
      customers: documents,
      total,
    });
  } catch (error) {
    console.error("Error retrieving customers:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving customers")
    );
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const customerService = new CustomerService(MongoDB.client);
    const document = await customerService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "User not found!"));
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const customerService = new CustomerService(MongoDB.client);

    const document = await customerService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "User not found!"));
    }
    return res.send({ message: "User was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const customerService = new CustomerService(MongoDB.client);
    const document = await customerService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found!"));
    }
    return res.send({ message: "User was deleted successfully!" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete user with id=${req.params.id}`)
    );
  }
};
