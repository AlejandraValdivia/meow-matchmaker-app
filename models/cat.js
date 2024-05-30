const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const catSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true},
    image: { type: String},
    lifeSpan: { type: String},
    origin: { type: String},
    affectionLevel: { type: Number}
}, { timestamps: true });



// create the model and export it
const Cat = mongoose.model('Cat', catSchema);

// make this model available for the index file
module.exports = Cat;
