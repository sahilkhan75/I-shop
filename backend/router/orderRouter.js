const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controller/orderController")


orderRouter.post("/place-order",orderController.placeOrder)
orderRouter.post("/success",orderController.orderSuccess)
orderRouter.get("/",orderController.getOrders)
orderRouter.get("/:orderId",orderController.getOrderById)

module.exports = orderRouter;
