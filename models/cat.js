const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const catSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true},
}, { timestamps: true });

catSchema.pre('save', function(next) {
    console.log('---------- PASSWORDS ----------------', this.password ); // delete later...
    let hash = bcrypt.hashSync(this.password, 12);
    console.log('---------- HASH ----------------', hash); // might delete later
    this.password = hash;
    next();
})

// create the model and export it
const Cat = mongoose.model('User', catSchema);

// make this model available for the index file
module.exports = Cat;
