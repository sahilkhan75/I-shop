const express = require("express");
const userModel = require("../model/userModel");
const { generateToken } = require("../helper");
const Cryptr = require('cryptr');

console.log("SECRET_KEY is:", process.env.SECRET_KEY);
const cryptr = new Cryptr(process.env.SECRET_KEY);

const userController = {
    async register(req, res) {
        try {
            const { name, password, email, shipping_address } = req.body;
            console.log(req.body);

            if (!password || !name || !email) {
                return res.send({ msg: "All fields are required", flag: 0 });
            }

            const userExisting = await userModel.findOne({ email: email });
            if (userExisting) {
                return res.send({ msg: "Try with a different email ID", flag: 0 });
            }

            const user = new userModel({
                name,
                email,
                password: cryptr.encrypt(password),
                shipping_address
            });

            await user.save();

            res.send({
                msg: "Account created successfully",
                flag: 1,
                user: { ...user.toJSON(), password: null },
                token: generateToken({ ...user.toJSON() })
            });

        } catch (error) {
            console.log(error);
            res.send({ msg: "Error in userController", flag: 0, error });
        }
    },

    async login(req, res) {
        try {
            const { password, email } = req.body;
            console.log(req.body);

            if (!password || !email) {
                return res.send({ msg: "All fields are required", flag: 0 });
            }

            const user = await userModel.findOne({ email: email });
            console.log(user, "User found");

            if (user) {
                const decryptedPassword = cryptr.decrypt(user.password);
                if (decryptedPassword === password) {
                    res.send({
                        msg: "Login successfully",
                        flag: 1,
                        user: { ...user.toJSON(), password: null },
                        token: generateToken({ ...user.toJSON()})
                    });
                } else {
                    res.send({ msg: "Incorrect password", flag: 0 });
                }
            } else {
                res.send({ msg: "Email not found", flag: 0 });
            }

        } catch (error) {
            console.log(error, "user error");
            res.send({ msg: "Error in user Controller", flag: 0, error });
        }
    },
};

module.exports = userController;
