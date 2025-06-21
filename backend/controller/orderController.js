const CartModel = require("../model/cartModel");


const orderController = {

  async placeOrder(req, res) {
    try {

      const {user_id,order_total,payment_mode,shipping_details} =req.body;
      const cart = await CartModel.findOne({user_id});
      console.log(cart,"from checkout")
      const product_details = cart.modifiedPaths()

    } catch (error) {
      console.log(error)
      res.send({ msg: "Internal server error", flag: 0 })
    }

  }
}

module.exports = orderController;