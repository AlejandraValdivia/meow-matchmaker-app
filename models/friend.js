const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    friendId: { type: String, required: true}
})

const Friend = mongoose.model('Friend', friendSchema);
module.exports = Friend;