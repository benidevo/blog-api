const express = require('express');
const router = express.Router();
const app = express()

const { createPostValidation, updatePostValidation } = require('../app/middlewares/posts');
const { createCommentsValidation, updateCommentsValidation } = require('../app/middlewares/comments');
const { createPost, updatePost, retrievePost, deletePost, retrieveAllPosts } = require('../app/controllers/postControllers');
const { addCommentToPost, updateCommentOnPost, getAllCommentOnPost, retrieveSingleComment, deleteCommentOnPost } = require('../app/controllers/commentControllers');
const { auth } = require('../app/middlewares/auth');

// create blog post
router.post('/', [auth, createPostValidation], createPost);

// add comment to blog post
router.post('/:blogId/comments', createCommentsValidation, addCommentToPost);

// update comment on a blog post
router.put('/:blogId/comments/:commentId', updateCommentsValidation, updateCommentOnPost);

// delete comment on a blog post
router.delete('/:blogId/comments/:commentId', deleteCommentOnPost);

// retrieve a single comment
router.get('/:blogId/comments/:commentId', retrieveSingleComment);

// retrieve all comments on a blog post
router.get('/:blogId/comments', getAllCommentOnPost);

// retrieve all blog posts
router.get('/', retrieveAllPosts);

// update blog post
router.put('/:blogId', [auth, updatePostValidation], updatePost);

// retrieve blog post
router.get('/:blogId', auth, retrievePost);

// delete blog post
router.delete('/:blogId', auth, deletePost);

module.exports = router;
