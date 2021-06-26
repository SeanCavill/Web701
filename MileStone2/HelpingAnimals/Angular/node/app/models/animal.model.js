const mongoose = require("mongoose");

const Animal = mongoose.model(
  "Animal",
  new mongoose.Schema({
    animalName: String,
    species: String,
    description: String,       
    lister: 
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
      }
  })
);

module.exports = Animal;
