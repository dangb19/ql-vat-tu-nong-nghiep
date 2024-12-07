const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ApiError = require("./app/api-error");

const customerRouter = require("./app/routes/customer.route");
const userRouter = require("./app/routes/user.route");
const supplierRouter = require("./app/routes/supplier.route");
const manufacturerRouter = require("./app/routes/manufacturer.route");
const categoryRouter = require("./app/routes/category.route");
const discountRouter = require("./app/routes/discount.route");
const inventoryRouter = require("./app/routes/inventory.route");
const productRouter = require("./app/routes/product.route");
const orderRouter = require("./app/routes/order.route");
const reportRouter = require("./app/routes/report.route");

const app = express(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Okay" });
});

app.use("/api/customer", customerRouter);
app.use("/api/user", userRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/manufacturer", manufacturerRouter);
app.use("/api/category", categoryRouter);
app.use("/api/discount", discountRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/report", reportRouter);

// Error Handler
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal sever error",
  });
});

module.exports = app;
