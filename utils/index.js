const bcrypt = require('bcryptjs');

function validPassword(typedPassword, userPassword) {
    let isCorrectPassword = bcrypt.compareSync(typedPassword, userPassword);

    return isCorrectPassword; // returns true if the password is correct or false otherwise
}

module.exports = {
    validPassword,
    // any other methods needed with go here
}