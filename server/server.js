const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const models = require("./models.js");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.text());

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

app.post("/register", (req, res) => {
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
        res.status(200).send();
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    });
});

app.post("/add_task", (req, res) => {
  getUser(req.header("SessionID")).then((user) => {
    const task = new models.Task({
      userID: user._id,
      description: req.body.description,
      dateCreated: req.body.dateCreated,
    });
    task.save((err, task) => {
      if (err) {
        res.status(500).send();
        return console.error(err);
      }
      res.status(200).send();
    });
  });
});

app.post("/delete_task", (req, res) => {
  getUser(req.header("SessionID")).then((user) => {
    models.Task.deleteOne({ _id: req.body, userID: user._id })
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send();
      });
  });
});

app.post("/complete_task", (req, res) => {
  getUser(req.header("SessionID")).then((user) => {
    models.Task.findOneAndUpdate(
      { _id: req.body, userID: user._id },
      { done: true }
    )
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send();
      });
  });
});

app.get("/tasks", (req, res) => {
  getUser(req.header("SessionID")).then((user) => {
    models.Task.find({ userID: user._id }).then((tasks) => {
      res.send(JSON.stringify(tasks));
    });
  });
});

async function getUser(sessionid) {
  return await models.User.findOne({ sessionID: sessionid });
}

async function run() {
  // Connect to database
  try {
    await mongoose.connect("mongodb://localhost:27017/test", {
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }

  // Listen on port
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}
run();
