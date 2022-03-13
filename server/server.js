const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  console.log("POST");
  res.send(`${req.body.username}, ${req.body.password}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
