const sql = require("mysql");
const config = require("./config");

const transaction = async (query, closeDb = true) => {
  console.log("config====", config);
  let pool = await sql.connect(config);

  //Create request for store procedure
  // let result = await pool.request().query(query);
  const transaction = await new sql.Transaction(pool);

  //Disconnect from db
  return transaction;
};

module.exports = transaction;
