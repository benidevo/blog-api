const express = require('express');

const router = express.Router();

const {
    register,
    login,
    changePassword,
} = require('../app/controllers/authController');
const {
    registrationValidation,
    loginValidation,
    changePasswordValidation,
} = require('../app/middlewares/auth');

// register new users
router.post('/register', registrationValidation, register);

// authenticate users
router.post('/login', loginValidation, login);

// change password
router.post('/change-password', changePasswordValidation, changePassword);

module.exports = router;
