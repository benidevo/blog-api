const express = require('express');
const router = express.Router();

const { createPostValidation } = require('../app/middlewares/posts');
const { createPost, updatePost, retrievePost, deletePost, retrieveAllPosts } = require('../app/controllers/postControllers');
const { auth } = require('../app/middlewares/auth');

// create blog post
router.post('/', [auth, createPostValidation], createPost);

// retrieve all blog posts
router.get('/', auth, retrieveAllPosts);

// update blog post
router.put('/:id', [auth, createPostValidation], updatePost);

// retrieve blog post
router.get('/:id', auth, retrievePost);

// delete blog post
router.delete('/:id', auth, deletePost);

module.exports = router;
