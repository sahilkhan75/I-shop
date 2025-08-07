require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const categoryRouter = require("./router/categoryRouter");
const colorRouter = require("./router/colorRouter");
const productRouter = require("./router/productRouter");
const adminRouter = require("./router/adminRouter");
const UserRouter = require('./router/userRouter');
const cartRouter = require('./router/cartRouter');
const orderRouter = require('./router/orderRouter');

const server = express();
server.use(cors());
server.use(express.json());

server.use("/category", categoryRouter);
server.use("/color", colorRouter);
server.use("/product", productRouter);
server.use("/admin", adminRouter);
server.use("/user", UserRouter);
server.use("/cart", cartRouter);
server.use("/order", orderRouter);
server.use(express.static("./public"));


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB, { dbName: 'WSJP87' }).then(() => {
    server.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
    });
    console.log(" Connected to MongoDB");
}).catch((err) => {
    console.log(" Error connecting to MongoDB:", err);
});
