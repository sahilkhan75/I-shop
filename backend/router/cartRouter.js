const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controller/cartController");

cartRouter.post("/move-to-db", cartController.moveToDb);
cartRouter.get("/user/:user_id", cartController.getUserCart); 
cartRouter.post("/add-to-cart", cartController.addToCart);
cartRouter.post("/remove-item", cartController.removeFromCart);

module.exports = cartRouter;
