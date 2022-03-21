const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 24,
    },
    password: {
      type: String,
      required: true,
    },
    sessionID: {
      type: String,
    },
  },
  { autoCreate: true }
);
const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 90,
    },
    dateCreated: {
      type: Date,
      required: true,
    },
    done: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    autoCreate: true,
  }
);
const Task = mongoose.model("Task", taskSchema);

module.exports = { User, Task };
