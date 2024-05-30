const { Cat } = require("../models");

// Create a user
Cat.create({
  name: "puffy",
  origin: "australia",
  image: "https://i.imgur.com/2B25MrM.jpeg",
  description: "cats are cute",
  lifeSpan: "10-15",
  affectionLevel: "5",
})
  .then((user) => {
    console.log("---- NEW CAT ----", cat);
  })
  .catch((error) => {
    console.log("---- ERROR ----", error);
  });
