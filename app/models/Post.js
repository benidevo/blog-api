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
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

PostSchema.pre('remove', async function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    await Comment.deleteOne({post: this._id}).exec();
    next();
});

module.exports = mongoose.model('Post', PostSchema);
