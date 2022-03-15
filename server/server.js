const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const models = require("./models.js");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  // Try to login
  models.User.exists({
    username: req.body.username,
    password: req.body.password,
  }).then((result) => {
    // If input is valid
    if (result) {
      const sessionID = crypto.randomUUID();
      models.User.updateOne(
        { username: req.body.username },
        { sessionID: sessionID }
      )
        .then(() => {
          res.send(sessionID);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    } else {
      res.status(401).send();
    }
  });
});

app.put("/register", (req, res) => {
  // Check if this username is used, register if not
  models.User.exists({ username: req.body.username })
    .then((result) => {
      if (result) {
        res.send("User with this username exists");
      } else {
        const newUser = new models.User({
          username: req.body.username,
          password: req.body.password,
        });
        newUser.save();
        res.send("User registered");
      }
    })
    .catch((err) => {
      res.status(500).send();
    });
});

async function run() {
  // Connect to database
  try {
    await mongoose.connect("mongodb://localhost:27017/test", {
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.log(err);
    process.exit();
  }

  // Listen on port
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}
run();
