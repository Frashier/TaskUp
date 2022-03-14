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
  console.log("POST");
  res.send(crypto.randomUUID());
});

app.put("/register", (req, res) => {
  console.log("PUT");
});

async function run() {
  await mongoose
    .connect("mongodb://localhost:27017/test", {
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })
    .catch((err) => {
      console.log("Database connection time out");
      process.exit();
    });
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}
run();
