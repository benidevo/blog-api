const jwt = require('jsonwebtoken');
const { check } = require('express-validator');
require('dotenv').config();

const { error } = require('../utils/apiResponse');

exports.registrationValidation = [
	check('name', 'Name is required').not().isEmpty(),
	check('email', 'Provide a valid email address').isEmail(),
	check('password', 'Provide a password of 6 or more characters').isLength({ min: 6 })
];

exports.loginValidation = [
	check('email', 'Provide a valid email address').isEmail(),
	check('password', 'Provide a password of 6 or more characters').isLength({ min: 6 })
];

exports.changePasswordValidation = [
	check('email', 'Provide a valid email address').isEmail(),
	check('oldPassword', 'Provide a password of 6 or more characters').isLength({ min: 6 }),
	check('newPassword', 'Provide a password of 6 or more characters').isLength({ min: 6 })
];

exports.auth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json(error('No token, authorization denied!'))
	};

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

		req.user = decoded;
        next();
	} catch (err) {
		console.log(err.message)
        res.status(401).json(error('Invalid token'))
    }
};
