const { validationResult } = require('express-validator');
require('dotenv').config();

const { success, error, validation } = require('../utils/apiResponse');
const Post = require('../models/Post');
const Comment = require('../models/Comment');


// @desc       Add a comment to a blog post
// @method     POST
// @access     Public
exports.addCommentToPost = async (req, res) => {
    //  validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(validation(errors.array()));
    };

    const { author, comment } = req.body;

    // create comment
    let newComment;
    try {
        newComment = new Comment({
            author,
            comment,
        });

        await newComment.save()
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error'));   
    }

    // find post
    let post;
    try {
        post = await Post.findById(req.params.blogId);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error'));
    }

    if (!post) {
        return res.status(404).json(error('Blog post with the provided ID does not exist'));
    };

    // add comment to post
    post.comments.push(newComment._id)
    await post.save()

    // link post to new comment
    newComment.post = post._id
    await newComment.save();

    return res.status(201).json(success('Successfully commented on blog post', newComment));
};


// @desc       Update a comment on a blog post
// @method     PUT
// @access     Public
exports.updateCommentOnPost = async (req, res) => {
    // find post
    let post;
    try {
        post = await Post.findById(req.params.blogId);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error'));
    }

    if (!post) {
        return res.status(404).json(error('Blog post with the provided ID does not exist'));
    };
    
    // find and update comment
    let existingComment;
    try {
        existingComment = await Comment.findById(req.params.commentId).select('-__v');
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal Server error'));
    }
    
    if (!existingComment) {
        return res.status(404).json(error('Comment with the provided ID does not exist'));
    };
    
    const { author, comment } = req.body;
    if (author) { existingComment.author = author };
    if (comment) { existingComment.comment = comment };
    existingComment.updatedAt = Date.now();
    await existingComment.save();
    
    return res.status(200).json(success('Successfully updated comment', existingComment));
};


// @desc       Retrieve all comments on a blog post
// @method     GET
// @access     Public
exports.getAllCommentOnPost = async (req, res) => {
    // find post
    let post;
    try {
        post = await Post.findById(req.params.blogId).populate('comments', '-__v');
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal Server error')); 
    }
    
    if (!post) {
        return res.status(404).json(error('Post with the provided ID does not exist'));
    };
    
    const data = post.comments;
    
    return res.status(200).json(success('Successfully retrieved all comments', data))
};


// @desc       Retrieve single comment on a blog post
// @method     GET
// @access     Public
exports.retrieveSingleComment = async (req, res) => {
    // find post
    let post;
    try {
        post = await Post.findById(req.params.blogId).populate('comments', '-__v');
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error'));
    }
    
    if (!post) {
        return res.status(404).json(error('Blog post with the provided ID does not exist'));
    };
    
    // find comment and retrieve comment
    let comment;
    try {
        comment = await Comment.findById(req.params.commentId);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal Server error')); 
    }
    
    if (!comment) {
        return res.status(404).json(error('Comment with the provided ID does not exist'));
    };
    
    return res.status(200).json(success('Successfully retrieved comment', comment));
};


// @desc       Retrieve single comment on a blog post
// @method     GET
// @access     Public
exports.deleteCommentOnPost = async (req, res) => {
     // find post
    let post;
    try {
        post = await Post.findById(req.params.blogId);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error'));
    }

    if (!post) {
        return res.status(404).json(error('Blog post with the provided ID does not exist'));
    };

    // find comment and delete comment
    let comment;
    try {
        comment = await Comment.findById(req.params.commentId);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal Server error')); 
    }

    if (!comment) {
        return res.status(404).json(error('Comment with the provided ID does not exist'));
    };

    post.comments.pop(comment._id);
    await post.save();
    await comment.delete();

    return res.status(404).json(success('Successfully deleted comment', data = {}));
};
