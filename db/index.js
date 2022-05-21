const sql = require("mysql");
const config = require("./config");
var pool = null;
const excuteStoreProc = (query, closeDb = false, cb = () => null) => {
  console.log("config====", query);
  try {
    //Connect to db

    pool = sql.createConnection(config);

    pool.connect(function (err) {
      console.log("error==", err);
      if (err) throw err;
      console.log("Connected!");
      pool.query(query, function (err2, result) {
        if (err2) throw err2;
        console.log("Database created", result);
        console.log("error==2", err2);
        cb([]);
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
    console.log("error===db", error);
    pool = null;
    throw error;
  }
};

module.exports = excuteStoreProc;
