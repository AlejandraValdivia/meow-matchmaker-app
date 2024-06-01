const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({   
    userId: { type: String, required: true},
    title: { type: String, required: true},
    content: { type: String, required: true},
    userId: { type: String, required: true}
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;