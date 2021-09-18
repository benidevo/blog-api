const { check } = require('express-validator');

exports.createCommentsValidation = [
    check('author', 'Provide an author for this comment').trim().escape().not()
        .isEmpty(),
    check('comment', 'Kindly provide a comment').trim().escape().not()
        .isEmpty(),
];

exports.updateCommentsValidation = [
    check('author', 'Provide an author for this comment').trim().escape(),
    check('comment', 'Kindly provide a comment').trim().escape(),
];
