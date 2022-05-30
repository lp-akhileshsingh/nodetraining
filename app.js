const express = require("express");
const cors = require("cors");
const sql = require("mysql");
const app = express();
const spoc = require("./db");
const config = require("./db/config");
const UserAuth = require("./routes/auth");
const Master = require("./routes/master");
const createTables = require("./helper/createTables");
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json({ limit: "100mb", extended: true }));
app.use(cors());

require("dotenv").config();

app.use("/user_auth", UserAuth);
app.use("/masters", Master);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welocome to Node Trainings!",
  });
});

app.listen(port, async (req, res) => {
  await spoc("CREATE DATABASE IF NOT EXISTS nodetraining", false, function (
    data
  ) {});
  createTables();
  console.log(`Port started on ${port}`);
});

module.exports = app;
