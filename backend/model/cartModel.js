const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
            
        },
        product_id: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true
        },
        qty: {
            type: Number,
            min: 1,
            required: true,
            default: 1
        }

    },
    {
        timestamps: true
    }
)

const CartModel = mongoose.model("Cart", cartSchema)

module.exports = CartModel;