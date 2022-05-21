const { errorResponse } = require(".");
var spoc = require("../db");
var { decodeToken } = require("./index");
const isAuthenticated = (data) => {
  return async (req, res, next) => {
    console.log("req==", req.query);
    try {
      const token = req.headers.token;
      if (token === null) {
        res.status(200).json({
          error: true,
          message: "Session expired. Please login",
        });
      }
      console.log("token=====", token);
      const decoded = decodeToken(req.headers.token);
      console.log("decodes====", decoded);
      let data = await spoc(
        `SELECT * FROM user WHERE UserId = ${decoded.UserId}`
      );
      console.log();
      if (data.length > 0) {
        req.user = data[0];
        console.log("req.user==", req.user);
        if (req.user.IsActive != 1) {
          return errorResponse(req, res, {
            error: true,
            message: "This user has been decativated.",
            logout: true,
          });
        }
        next();
      } else {
        errorResponse(req, res, {
          error: true,
          message: "Authentication failed!",
          logout: true,
        });
      }
    } catch (error) {
      return res.status(200).json({
        error: true,
        message: error.message,
      });
    }
  };
};
const validateRoutes = (route, manipulation) => {
  return async (req, res, next) => {
    let data = await spoc(`SELECT DISTINCT emp.UserId, emp.Salutation,emp.FirstName,emp.LastName, emp.Mobile, rl.Id as RoleId, rl.Name as RoleName,md.Id As ModuleId, md.Name as ModuleName,  rm.addeditallowed  
      FROM masters.Users emp 
      LEFT OUTER JOIN Roledetails rd ON emp.UserId = rd.UserId 
      LEFT OUTER JOIN RoleModules rm ON rd.RoleId = rm.RoleId 
      LEFT OUTER JOIN Roles rl ON rd.RoleId = rl.Id 
      LEFT OUTER JOIN Modules md ON rm.moduleId = md.Id 
      WHERE emp.UserId= ${req.user.UserId}`);
    let index = data.findIndex((val) => val.ModuleName == route);
    if (index > -1) {
      if (!manipulation) {
        next();
      } else {
        let index2 = data.findIndex(
          (val) => val.ModuleName == route && val.addeditallowed
        );
        if (index2 > -1) {
          next();
        } else {
          return errorResponse(req, res, {
            error: true,
            message: "Invalid access !",
          });
        }
      }
    } else {
      return errorResponse(req, res, {
        error: true,
        message: "Invalid access !",
      });
    }
  };
};
module.exports = {
  isAuthenticated,
  validateRoutes,
};
