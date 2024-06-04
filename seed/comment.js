const { Comment } = require("../models");


// Create a user
Comment.create({
    username: "alexandra",
    comment: "i like cats",
})
    .then((user) => {
        console.log("---- NEW COMMENT ----", comment);
    })
    .catch((error) => {
        console.log("---- ERROR ----", error);
    })

Comment.create({ username: "alexandra", comment: "I created this Cat Matchmaker App!" })
    .then((user) => {
        console.log("---- NEW COMMENT ----", comment);
    })
    .catch((error) => {
        console.log("---- ERROR ----", error);
    })

Comment.create({ username: "alexandra", comment: "What is your favorite breed of cat" })
Comment.create({ username: "alexandra", comment: "What is your favorite color of cat" })