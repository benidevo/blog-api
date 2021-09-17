const { check } = require('express-validator');

exports.createPostValidation = [
    check('title', 'Provide a blog post title').not().isEmpty().trim().escape(),
    check('body', 'Provide blog post content').not().isEmpty().trim().escape(),
];

exports.updatePostValidation = [
    check('title', 'Provide a valid blog post title').trim().escape(),
    check('body', 'Provide a valid blog post content').trim().escape(),
];
