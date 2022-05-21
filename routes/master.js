const express = require("express");
const router = express.Router();
router.get("/user", (req, res, next) => {
  res.status(200).json({
    message: "User Master",
  });
});
router.post("/user", (req, res, next) => {
  try {
    res.status(200).json({
      message: "User Master",
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
