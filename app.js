const express = require("express");
const cors = require("cors");
const sql = require("mysql");
const app = express();
const spoc = require("./db");
const config = require("./db/config");
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json({ limit: "100mb", extended: true }));
app.use(cors());
const UserAuth = require("./routes/auth");
require("dotenv").config();

app.use("/user_auth", UserAuth);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welocome to Node Trainings!",
  });
});

app.listen(port, async (req, res) => {
  await spoc("CREATE DATABASE IF NOT EXISTS nodetraining");
  let pool = sql.createConnection(config);

  pool.connect(function (err) {
    console.log("error==", err);
    if (err) throw err;
    console.log("Connected!");
    pool.query(
      "CREATE TABLE IF NOT EXISTS user (name VARCHAR(255), address VARCHAR(255), email VARCHAR(255), mobile VARCHAR(255), password VARCHAR(255),id INT NOT NULL PRIMARY KEY AUTO_INCREMENT)"
    );
    pool.query(
      "CREATE TABLE IF NOT EXISTS Roles (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255))"
    );
    pool.query(
      "CREATE TABLE IF NOT EXISTS Modules (Id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(255),Parent VARCHAR(255),SubParent VARCHAR(255),Routes VARCHAR(255))"
    );
    pool.query(
      "CREATE TABLE IF NOT EXISTS Roledetails (uniqueId INT NOT NULL , UserId INT,RoleId INT(255))"
    );
    pool.query(
      "CREATE TABLE IF NOT EXISTS RoleModules (Id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, RoleId INT,moduleId INT,addeditallowed BOOL)"
    );
    pool.query(
      "CREATE TABLE IF NOT EXISTS UserInRoleDetails (UIRId VARCHAR(200), StateId INT,DistrictId INT,BlockId INT,CenterId INT)"
    );
  });

  console.log(`Port started on ${port}`);
});

module.exports = app;
