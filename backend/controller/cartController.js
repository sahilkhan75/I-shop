
// const express = require("express");
// const CartModel = require("../model/cartModel")


// // const cartController = {
// //     async moveToDb(req, res) {
// //         try {
// //             const { cart, user_id } = req.body
// //             if (Array.isArray(cart) && cart.length > 0) {
// //                 const allPromises = cart.map(async (item) => {
// //                     const { productId, qty } = item
// //                     const existingICart = await CartModel.findOne({ user_id, product_id: productId })

// //                     if (existingICart) {
// //                         existingICart.qty += Number(qty)
// //                     } else {
// //                         await CartModel.create({
// //                             user_id: user_id,
// //                             product_id: productId,
// //                             qty: 1
// //                         })
// //                     }
// //                 })

// //                 await Promise.all(allPromises)
// //             }
// //             const updatedCart = await CartModel.find({ user_id }).populate(
// //                 'product_id',
// //                 '_id finalPrice orignalPrice '
// //             )
// //             res.send({ msg: 'Cart Proccessed successfully', flag: 1, cart: updatedCart })
// //         } catch (error) {
// //             res.send({ msg: "Error in cartController ", flag: 0, error })
// //             console.log(error);

// //         }
// //     },

// // }


// const cartController = {
//     async moveToDb(req, res) {
//         try {
//             const { cart, user_id } = req.body;
//             console.log(req.body)

//             if ( Array.isArray(cart) && cart.length > 0) {

//             const allPromises = cart.map(async (item) => {
//                 const { productId, qty } = item;

//                 if (!productId || !qty) return;

//                 const existing = await CartModel.findOne({ user_id, product_id: productId });

//                 if (existing) {
//                     existing.qty += Number(qty);
//                     await existing.save(); // 
//                 } else {
//                     await CartModel.create({
//                         user_id,
//                         product_id: productId,
//                         qty: Number(qty),
//                     });
//                 }
//             });

//             await Promise.all(allPromises);

//         }

//             const updatedCart = await CartModel.find({ user_id })


//                 .populate({
//                     path: 'product_id',
//                     match: { status: true },
//                     select: '_id name thumbnail finalPrice orignalPrice'
//                 })

//                 .sort({ updatedAt: -1 }); // latest first


//             res.status(200).json({
//                 msg: "Cart processed successfully",
//                 flag: 1,
//                 cart: updatedCart,
//             });
//         } catch (error) {
//             console.error(" Cart error:", error);
//             res.status(500).json({ msg: "Error in cartController", flag: 0, error: error.message });
//         }
//     },
// };



// module.exports = cartController;




// backend/controller/cartController.js

const CartModel = require("../model/cartModel");

const cartController = {
    async moveToDb(req, res) {
        try {
            const { cart, user_id } = req.body;

            if (Array.isArray(cart) && cart.length > 0) {
                const allPromises = cart.map(async (item) => {
                    const { productId, qty } = item;
                    if (!productId || !qty) return;

                    const existing = await CartModel.findOne({ user_id, product_id: productId });

                    if (existing) {
                        existing.qty += Number(qty);
                        await existing.save();
                    } else {
                        await CartModel.create({
                            user_id,
                            product_id: productId,
                            qty: Number(qty),
                        });
                    }
                });

                await Promise.all(allPromises);
            }

            const updatedCart = await CartModel.find({ user_id })
                .populate({
                    path: 'product_id',
                    match: { status: true },
                    select: '_id name thumbnail finalPrice orignalPrice'
                })
                .sort({ updatedAt: -1 });

            res.status(200).json({
                msg: "Cart processed successfully",
                flag: 1,
                cart: updatedCart,
            });
        } catch (error) {
            console.error("Cart error:", error);
            res.status(500).json({ msg: "Error in cartController", flag: 0, error: error.message });
        }
    },





    
    async getUserCart(req, res) {
        try {
            const { user_id } = req.params;

            const cart = await CartModel.find({ user_id })
                .populate({
                    path: 'product_id',
                    match: { status: true },
                    select: '_id name thumbnail finalPrice orignalPrice',
                })
                .sort({ updatedAt: -1 });

            res.status(200).json({
                msg: "Cart fetched successfully",
                flag: 1,
                cart
            });
        } catch (error) {
            console.error("Fetch cart error:", error);
            res.status(500).json({
                msg: "Error fetching user cart",
                flag: 0,
                error: error.message,
            });
        }
    }
};

module.exports = cartController;
