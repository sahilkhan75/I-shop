const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controller/orderController")


orderRouter.post("/place-order",orderController.placeOrder)

module.exports = orderRouter;
