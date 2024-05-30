const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({   
    userId: { type: String, required: true},
    title: { type: String, required: true},
    content: { type: String, required: true},
    userId: { type: String, required: true}
});

const Post = mongoose.model('Post', profileSchema);

module.exports = Post;