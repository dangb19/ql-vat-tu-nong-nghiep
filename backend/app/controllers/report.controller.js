const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const OrderService = require("../services/order.service");

const MongoDB = require("../utils/mongodb.util");

const convertToObjectId = (str) =>
  ObjectId.isValid(str) ? new ObjectId(str) : null;

function getSearchCriteria(type) {
  // Hôm nay
  if (type === "today") {
    return {
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(24, 0, 0, 0)),
      },
    };
  }

  // Tháng này
  if (type === "thismonth") {
    return {
      date: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Đầu tháng
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), // Đầu tháng sau
      },
    };
  }

  // Năm nay
  if (type === "thisyear") {
    return {
      date: {
        $gte: new Date(new Date().getFullYear(), 0, 1), // Ngày đầu năm
        $lt: new Date(new Date().getFullYear() + 1, 0, 1), // Ngày đầu năm sau
      },
    };
  }

  // Toàn thời gian
  return {};
}

function getRevenueProfitPipiline(type) {
  return [
    // Bước 1: Match các order theo thời gian mong muốn (hôm nay, tháng, năm, toàn thời gian)
    {
      $match: getSearchCriteria(type),
    },
    // Bước 2: Tính tổng doanh thu
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        orders: { $push: "$orderDetails" }, // Lưu toàn bộ orderDetails để xử lý
      },
    },
    // Bước 3: Unwind từng sản phẩm trong orderDetails
    {
      $unwind: "$orders",
    },
    {
      $unwind: "$orders", // Nếu orderDetails là mảng sản phẩm, cần unwind lần nữa
    },
    // Bước 4: Join với Inventory để lấy thông tin giá nhập
    {
      $lookup: {
        from: "inventory",
        localField: "orders.productId",
        foreignField: "product",
        as: "inventoryData",
      },
    },
    {
      $unwind: "$inventoryData", // Giả định mỗi sản phẩm chỉ liên quan tới một bản ghi inventory
    },
    // Bước 5: Tính giá nhập trung bình và chi phí từng sản phẩm
    {
      $group: {
        _id: "$orders.productId",
        averageCostPrice: {
          $avg: "$inventoryData.costPrice", // Tính giá nhập trung bình
        },
        quantitySold: { $sum: "$orders.quantity" }, // Tổng số lượng đã bán
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        totalCost: { $multiply: ["$averageCostPrice", "$quantitySold"] }, // Chi phí của sản phẩm
      },
    },
    // Bước 6: Tính tổng chi phí
    {
      $group: {
        _id: null,
        totalCost: { $sum: "$totalCost" },
      },
    },
    // Bước 7: Tính lợi nhuận (Doanh thu - Chi phí)
    {
      $lookup: {
        from: "order",
        pipeline: [
          {
            $match: getSearchCriteria(type),
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
        ],
        as: "revenueData",
      },
    },
    {
      $unwind: "$revenueData",
    },
    {
      $project: {
        _id: 0,
        totalRevenue: "$revenueData.totalRevenue",
        totalCost: 1,
        totalProfit: { $subtract: ["$revenueData.totalRevenue", "$totalCost"] },
      },
    },
  ];
}

exports.getTotalRevenueProfit = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);
    const pipelineToday = getRevenueProfitPipiline("today");
    const pipelineThisMonth = getRevenueProfitPipiline("thismonth");
    const pipelineThisYear = getRevenueProfitPipiline("thisyear");
    const pipelineAllTime = getRevenueProfitPipiline();

    const documentsToday = await orderService.Collection.aggregate(
      pipelineToday
    ).toArray();
    const documentsThisMonth = await orderService.Collection.aggregate(
      pipelineThisMonth
    ).toArray();
    const documentsThisYear = await orderService.Collection.aggregate(
      pipelineThisYear
    ).toArray();
    const documentsAllTime = await orderService.Collection.aggregate(
      pipelineAllTime
    ).toArray();

    return res.json({
      today: documentsToday[0],
      thismonth: documentsThisMonth[0],
      thisyear: documentsThisYear[0],
      alltime: documentsAllTime[0],
    });
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving doc"));
  }
};
