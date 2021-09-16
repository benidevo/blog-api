const { check } = require('express-validator');

exports.createPostValidation = [
  check('title', 'Provide a blog post title').not().isEmpty(),
  check('body', 'Provide blog post content').not().isEmpty(),
];
