const express = require("express");
const router = express.Router();
const { isAuthenticated, validateRoutes } = require("../helper/auth");
const {
  login,
  signup,
  getRoleRoutes,
  add_roles,
  add_modules,
  assign_role_modules,
  get_roles,
} = require("../controller/auth");
const { successResponse } = require("../helper");

router.post("/login", (req, res) => {
  login(req, res);
});

router.post("/signup", (req, res) => {
  signup(req, res);
});
router.get("/get_user", [isAuthenticated()], (req, res) => {
  successResponse(req, res, { error: false, data: req.user });
});

router.post(
  "/assign_roles",
  [isAuthenticated(), validateRoutes("Roles", 1)],
  (req, res) => {
    successResponse(req, res);
  }
);

router.get("/get_role_routes", [isAuthenticated()], (req, res) => {
  getRoleRoutes(req, res);
});
router.post("/roles", (req, res, next) => {
  add_roles(req, res, next);
});
router.post("/add_modules", (req, res, next) => {
  add_modules(req, res, next);
});

router.post("/assign_role_modules", (req, res, next) => {
  assign_role_modules(req, res, next);
});

router.get("/roles", (req, res, next) => {
  get_roles(req, res, next);
});
module.exports = router;
