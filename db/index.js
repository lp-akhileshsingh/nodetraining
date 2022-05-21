const sql = require("mysql");
const config = require("./config");
var pool = null;
const excuteStoreProc = (query, closeDb = false) => {
  console.log("config====", query);
  try {
    //Connect to db

    pool = sql.createConnection(config);

    return pool.connect(function (err) {
      console.log("error==", err);
      if (err) throw err;
      console.log("Connected!");
      return pool.query(query, function (err, result) {
        if (err) throw err;
        console.log("Database created");
        return result;
      });
    });

    // console.log("pool===", pool);
    // //Create request for store procedure
    // let result = await pool.query(query);

    // //Disconnect from db
    // if (closeDb) {
    //   await sql.close();
    //   pool = null;
    // }
    // return result.recordsets.length > 0
    //   ? result.recordsets.length > 1
    //     ? result.recordsets
    //     : result.recordsets[0]
    //   : [];
  } catch (error) {
    pool = null;
    throw error;
  }
};

module.exports = excuteStoreProc;
