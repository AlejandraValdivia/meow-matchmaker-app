const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String },
    postId: { type: String },
    username: { type: String },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;





