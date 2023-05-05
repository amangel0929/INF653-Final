const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StateSchema = new mongoose.Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true,
  },
  funfacts: [String],
});

module.exports = mongoose.model("State", StateSchema);