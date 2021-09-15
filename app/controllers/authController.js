const { success, error, validation } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// @desc       Register a new user
// @method     POST
// @access     Public
exports.register = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(validation(errors.array()));
    };

    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            return res.status(422).json(error("User with provided email already exists!"));;
        };

        let newUser = new User({
            name,
            email: email.toLowerCase().replace(/\s+/, ""),
            password,
        });

        // hash password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        // save user
        await newUser.save();

        // generate token
        let token;
        try {
            token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );
        } catch (err) {
            console.log(err)
            return res.status(500).json(error(
            'Registration failed, please try again later'));
        }

        // send response
        res
        .status(201)
        .json(success('Registration successful', { userId: newUser._id, name: newUser.name, email: newUser.email, token: token }));
    
    } catch (err) {
        console.error(err.message);
        res.status(500).json(error('Internal server error'));
    }
};

// @desc       Authenticate user
// @method     POST
// @access     Public
exports.login = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(validation(errors.array()))
    };

    const { email, password } = req.body;

    let user;
    try {
        user = await User.findOne({ email });
    } catch (err) {
        console.log(err);
        return res.status(500).json(error('Internal server error'));
    }

    if (!user) {
        return res.status(404).json(error('User does not exist'));
    };

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, user.password);
    } catch (err) {
        return res.status(500).json(error('Internal server error'));
    }

    if (!isValidPassword) {
        res.status(403).json(error('Invalid password'));
    };

    // generate token
    let token;
    try {
        token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    } catch (err) {
        return res.status(500).json('Internal Server error');
    }

    res.status(200).json(success('Login successful', {
        userId: user._id,
        email: user.email,
        token: token
    }));
};

// @desc       Reset user's password
// @method     POST
// @access     Public
exports.changePassword = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(validation(errors.array()));
    };

    const { email, oldPassword, newPassword } = req.body;

    let user;
    try {
        user = await User.findOne({ email });
    } catch (err) {
        console.log(err);
        return res.status(500).json(error('Internal server error'));
    }
    
    if (!user) {
        return res.status(404).json(error('User with the provided email address does not exist'));
    };

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(oldPassword, user.password);
    } catch (err) {
        console.log(err)
        return res.status(500).json(error('Internal server error'))
    }

    if (!isValidPassword) {
        return res.status(403).json(error('Invalid password'));
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json(success('Successfully changed password. Proceed to login'));
};
