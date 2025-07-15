const CartModel = require("../model/cartModel");
const orderModel = require("../model/orderModel");

const Razorpay = require('razorpay');
var instance = new Razorpay(
  {
    key_id: process.env.RAZARPAY_KEY_ID,
    key_secret: process.env.RAZARPAY_KEY_SECRET
  })



const orderController = {
  async placeOrder(req, res) {
    try {
      //  console.log(req.body,"reqqqqqqq")
      const { user_id, order_total, payment_mode, shipping_details } = req.body;
      const cart = await CartModel.find({ user_id }).populate(
        'product_id',
        '_id finalPrice'
      );
      console.log(cart, "from checkout")
      const product_details = cart.map((cd) => {
        console.log(cd, "cd ...")
        return {
          product_id: cd.product_id._id,
          qty: cd.qty,
          price: cd.product_id.finalPrice,
          total: (cd.qty * cd.product_id.finalPrice)
        }
      })

      const order = await new orderModel(
        {
          user_id: user_id,
          order_total: order_total,
          payment_mode: payment_mode,
          shipping_details: shipping_details,
          product_details: product_details,
        }
      ).save()


      if (payment_mode == 0) {
        console.log(order, "orderrr")
        await CartModel.deleteMany({ user_id })
        res.send({ msg: "order place succesfully", flag: 1, order_id: order._id })
      } else {
        var options = {
          amount: order_total * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          receipt: order._id
        };
        instance.orders.create(options, async function (err, Razorpayorder) {

          if (err) {
            console.log(err, "error in razarpay")
            res.seend({ msg: "payment failed", flag: 0 })
          } else {
            order.razorpay_order_id = Razorpayorder.id;
            await order.save()
            return res.send({ msg: "order placed succesfully", flag: 1, order_id: order._id, razorpay_order_id: Razorpayorder.id })
          }

        });

      }


    } catch (error) {
      console.log(error)
      res.send({ msg: "Internal server error", flag: 0 })
    }

  }
}

module.exports = orderController;