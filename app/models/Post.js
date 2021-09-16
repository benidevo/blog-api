const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    type: Date
  }
});

module.exports = mongoose.model('Post', PostSchema);
