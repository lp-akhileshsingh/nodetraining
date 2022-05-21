const sql = require("mysql");
const config = require("../db/config");

const createTables = () => {
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
};
module.exports = createTables;
