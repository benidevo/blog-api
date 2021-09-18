const mongoose = require('mongoose');

const Comment = require('./Comment');

const PostSchema = mongoose.Schema({
    author: {
        type: String,
        require: true,
        maxLength: 150,
    },
    title: {
        type: String,
        require: true,
        maxLength: 255,
    },
    body: {
        type: String,
        require: true,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// eslint-disable-next-line func-names
PostSchema.pre('remove', async function (next) {
    await Comment.deleteOne({ post: this._id }).exec();
    next();
});

module.exports = mongoose.model('Post', PostSchema);
