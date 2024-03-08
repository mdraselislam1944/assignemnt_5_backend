const userSchema = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const setUsers = async (req, res) => {
    const body = req.body;
    try {
        const result = await userSchema.findOne({ username: body.username });
        if (result) {
            return res.status(400).json({ statusCode: 2, message: "user already exist", status: "unsuccess", data: null })
        }
        bcrypt.hash(body.password, saltRounds, async function (err, hash) {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ statusCode: 2, message: 'Error hashing password', status: 'unsuccess', data: null });
            }
            body.password = hash;
            const newUser = new userSchema(body);
            try {
                await newUser.save();
                res.status(201).json({ statusCode: 1, message: 'Data saved successfully', status: 'success', data: null });
            } catch (error) {
                console.error('Error saving user:', error);
                res.status(500).json({ statusCode: 2, message: 'Error saving user', status: 'unsuccess', data: null });
            }
        });

    } catch (error) {
        return res.status(500).json({ statusCode: 2, message: error.message, status: "unsuccess", data: null })
    }
}

const getUser = async (req, res) => {
    const body = req.body;
    try {
        const result = await userSchema.findOne({ username: body.username });
        if (!result) {
            return res.status(400).json({ statusCode: 2, message: "user do not exist", status: "unsuccess", data: null })
        }
        bcrypt.compare(body.password, result.password, function (err, userInfo) {
            if (!userInfo) {
                return res.status(400).json({ statusCode: 2, status: "unsuccess", message: "Your password is wrong", data: null });
            }
            if (userInfo) {
                const jwtPayload = {
                    userId: result.username,
                    role: result.role,
                };
                const accessToken = jwt.sign(jwtPayload, process.env.jwt_access_secret, { expiresIn: '1h' });
                const refreshToken = jwt.sign(jwtPayload, process.env.jwt_access_secret, { expiresIn: '1d' });
                res.cookie('refreshToken', refreshToken, {
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    sameSite: 'none',
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                });
                return res.status(200).json({ status: "success", statusCode: 1, message: "user logged in successfully", data: { accessToken }, });
            }
            if (err) {
                return res.status(500).json({ statusCode: 2, status: "unsuccess", message: "something is wrong", data: null });
            }
        });
    } catch (error) {
        return res.status(500).json({ statusCode: 2, message: error.message, status: "unsuccess", data: null })
    }
}

module.exports = { setUsers, getUser }