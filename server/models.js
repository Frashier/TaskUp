const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  sessionID: {
    type: String,
  },
});
const userModel = mongoose.model("User", userSchema);

module.exports = { userModel };
