const { check } = require('express-validator');

exports.createCommentsValidation = [
    check('author', 'Provide an author for this comment').not().isEmpty(),
    check('comment', 'Kindly provide a comment').not().isEmpty(),
];
