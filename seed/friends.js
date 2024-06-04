const { Friend } = require("../models");

// Create a user

Friend.create({
    username: "alexandra",
    friendId: "100",
})
    .then((user) => {
        console.log("---- NEW FRIEND ----", friend);
    })
    .catch((error) => {
        console.log("---- ERROR ----", error);
    })


Friend.create({
    username: "1",
    friendId: "2",
})
    .then((user) => {
        console.log("---- NEW FRIEND ----", friend);
    })
    .catch((error) => {
        console.log("---- ERROR ----", error);
    })