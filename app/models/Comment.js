const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  author: {
    type: String,
  },
  comment: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
