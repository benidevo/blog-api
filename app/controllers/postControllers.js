const { validationResult } = require('express-validator');
require('dotenv').config();

const { success, error, validation } = require('../utils/apiResponse');
const Post = require('../models/Post');
const User = require('../models/User');

// @desc       Create a new blog post
// @method     POST
// @access     Private
exports.createPost = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(validation(errors.array()));
    }
    let user;
    try {
        user = await User.findById(req.user.userId);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error'));
    }

    if (!user) {
        return res.status(401).json(error('Authentication details required'));
    }

    const { title, body } = req.body;

    // create blog post
    const post = new Post({
        title,
        body,
        author: req.user.name,
    });

    try {
        await post.save();
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error: failed to save blog post'));
    }

    const result = post.toObject({
        versionKey: false,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    });
    return res.status(201).json(success('Successfully created blog post', result));
};

// @desc       Update a new blog post
// @method     PUT
// @access     Private
exports.updatePost = async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(validation(errors.array()));
    }

    // retrieve post
    let post;
    try {
        post = await Post.findById(req.params.blogId);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error: invalid blog post ID'));
    }

    if (!post) {
        return res.status(404).json(error('Blog post does not exist'));
    }

    // ensure that only a post's author can update the post
    if (post.author !== req.user.name) {
        return res.status(403).json(error('You are not permitted to update a post you did not create'));
    }

    // update post
    const { title, body } = req.body;

    if (title) { post.title = title; }
    if (body) { post.body = body; }
    post.updatedAt = Date.now();
    post.save();

    const result = post.toObject({
        versionKey: false,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    });

    return res.status(200).json(success('Successfully updated blog post', result));
};

// @desc       Retrieve a blog post
// @method     GET
// @access     Private
exports.retrievePost = async (req, res) => {
    // retrieve post
    let post;
    try {
        post = await Post.findById(req.params.blogId).populate('comments', '-__V, -post');
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error: invalid blog post ID'));
    }

    if (!post) {
        return res.status(404).json(error('Blog post does not exist'));
    }

    const result = post.toObject({
        versionKey: false,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    });

    return res.status(200).json(success('Successfully retrieved blog post', result));
};

// @desc       Retrieve all the blog posts
// @method     GET
// @access     Private
exports.retrieveAllPosts = async (req, res) => {
    // destructure page and limit and set default values
    const { page = 1, limit = 50 } = req.query;

    // retrieve all posts
    let posts;
    let count;
    try {
        posts = await Post.find().populate('comments', '-post').limit(limit * 1).skip((page - 1) * limit)
            .exec();

        // get total documents in the Posts collection
        count = await Post.countDocuments();
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error: failed to retrieve blog posts'));
    }

    const result = posts.map((post) => post.toObject({
        versionKey: false,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    }));

    const data = {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        posts: result,
    };

    return res.status(200).json(success('Successfully retrieved all blog posts', data));
};

// @desc       Delete a blog post
// @method     DELETE
// @access     Private
exports.deletePost = async (req, res) => {
    // retrieve post
    let post;
    try {
        post = await Post.findById(req.params.blogId);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(error('Internal server error: invalid blog post ID'));
    }

    if (!post) {
        return res.status(404).json(error('Blog post does not exist'));
    }

    // ensure that only a post's author can update the post
    if (post.author !== req.user.name) {
        return res.status(403).json(error('You are not permitted to delete a post you did not create'));
    }

    // delete post
    post.delete();
    return res.status(404).json(success('Successfully deleted blog post', {}));
};
