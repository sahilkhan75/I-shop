const CartModel = require("../model/cartModel");
const orderModel = require("../model/orderModel");
const crypto = require('crypto')
const Razorpay = require('razorpay');
const userModel = require("../model/userModel");
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

  },
  async orderSuccess(req, res) {
    try {
      // console.log(req.body,"from success")
      const { order_id, user_id, razorpay_response } = req.body;
      const order = await orderModel.findById(order_id);
      if (!order) {
        return res.send({ msg: "order not found", flag: 0 });
      }
      const user = await userModel.findById(user_id)
      if (!user) {
        return res.send({ msg: "user not found", flag: 0 })
      }

      if(order.payment_status == 1 ){
        return res.send({msg:"order already success  " , flag:0});
      }

      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZARPAY_KEY_SECRET)
        .update( razorpay_response.razorpay_order_id +"|" + razorpay_response.razorpay_order_id )
        .digest("hex");
        console.log(generated_signature,"generated signature")
        console.log(razorpay_response.razorpay_signature)
        if(generated_signature !==razorpay_response.razorpay_signature){
          return res.send({msg:"payment verification failed", flag:0});
        }
         


    } catch (error) {

    }
  }
}

module.exports = orderController;