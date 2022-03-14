const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sessionID: {
    type: String,
    required: true,
    default: null,
  },
});
const userModel = mongoose.model("User", userSchema);

exports.module = { userModel };
