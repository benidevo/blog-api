const { check } = require('express-validator');

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
