require("dotenv").config();
var jwt = require("jsonwebtoken");
let secret_key = "#$%@$%#@@I%%$N@#%&N@#$O#$%$T#%##$#E#$%R#%R%A";
const createToken = (result) => jwt.sign(result, secret_key);

const decodeToken = (tokens) => jwt.verify(tokens, secret_key);

// error response
/*
error will contain message and error status
*/
const errorResponse = (req, res, error) => {
  res.status(200).json(error);
};

//success response
/*
    data will contain message,data and error status
*/
const successResponse = (req, res, data) => {
  res.status(200).json(data);
};

//Generates random unique id
const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
//generate otp
const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

module.exports = {
  errorResponse,
  successResponse,
  generateOtp,
  createToken,
  decodeToken,
  uuidv4,
};
