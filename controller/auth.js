const bcrypt = require("bcrypt");

const spoc = require("../db");
const { errorResponse, successResponse, createToken } = require("../helper");
/**
 *
 * @param
 */
const login = async (req, res) => {
  try {
    let data = await spoc(
      `SELECT * FROM masters.Users WHERE Mobile = '${req.body.mobile}'`
    );
    console.log("data=====", data);
    if (data.length > 0) {
      if (bcrypt.compareSync(req.body.password, data[0].Password)) {
        if (data[0].IsActive == 1) {
          successResponse(req, res, {
            error: false,
            message: "Logged in successfully!",
            token: createToken(data[0]),
          });
        } else {
          errorResponse(req, res, {
            error: true,
            message: "This user has been decativated.",
          });
        }
      } else {
        errorResponse(req, res, {
          error: true,
          message: "Invalid Credentials!",
        });
      }
    } else {
      errorResponse(req, res, { error: true, message: "No such user found!" });
    }
  } catch (error) {
    errorResponse(req, res, { error: true, message: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { first_name, last_name, mobile, password } = req.body;
    let userData = await spoc(
      `SELECT * FROM masters.Users WHERE Mobile = '${req.body.mobile}'`
    );
    if (userData.length > 0) {
      return errorResponse(req, res, {
        error: true,
        message: "User already exists!",
      });
    }
    let tempPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    let data = await spoc(
      `INSERT INTO masters.Users(FirstName,LastName,Mobile,Password) VALUES ('${first_name}','${last_name}','${mobile}','${tempPassword}')`
    );
    console.log("data===", data);
    res.status(200).json({
      error: false,
      ...data,
    });
  } catch (error) {
    errorResponse(req, res, { error: true, message: error.message });
  }
};

const assignRoles = () => {};

const getRoleRoutes = async (req, res) => {
  try {
    const routes = [
      {
        name: "Dashboard",
        route: "/home/dashboard",
      },
      {
        name: "States",
        route: "/home/masters/states",
      },
      {
        name: "Dashboard",
        route: "/home/dashboard",
      },
      {
        name: "Dashboard",
        route: "/home/dashboard",
      },
      {
        name: "Dashboard",
        route: "/home/dashboard",
      },
      {
        name: "Dashboard",
        route: "/home/dashboard",
      },
    ];
    const portalRoutes = [
      {
        route: "/home/dashboard",
        module: "Dashboard",
        icon: "",
        type: "item",
      },
      {
        route: "#",
        module: "Masters",
        icon: "",
        type: "collapse",
        sub_menu: [
          {
            route: "#",
            module: "Address",
            icon: "",
            type: "collapse",
            sub_menu: [
              {
                route: "/home/masters/states",
                module: "States",
                icon: "",
                type: "item",
              },
            ],
          },

          {
            route: "#",
            module: "User Roles and Access",
            icon: "",
            type: "collapse",
            sub_menu: [
              {
                route: "/home/masters/employees",
                module: "Employees",
                icon: "",
                type: "item",
              },
              {
                route: "/home/masters/assign_roles",
                module: "Assign Role",
                icon: "",
                type: "item",
              },
            ],
          },
        ],
      },
      {
        route: "/order_booking",
        module: "Order Booking",
        icon: "",
      },
      {
        route: "/harvest_offer",
        module: "Harvest Offer",
        icon: "",
      },
      {
        route: "/roles",
        module: "Roles",
        icon: "",
      },
    ];

    let data = await spoc(`SELECT DISTINCT emp.UserId, emp.FirstName,emp.Salutation,emp.LastName, emp.Mobile, rl.Id as RoleId, rl.Name as RoleName,md.Id As ModuleId, md.Name as ModuleName,md.Parent,md.Routes,  rm.addeditallowed
      FROM masters.Users emp 
       INNER JOIN Roledetails rd ON emp.UserId = rd.UserId 
      LEFT OUTER JOIN RoleModules rm ON rd.RoleId = rm.RoleId 
      LEFT OUTER JOIN Roles rl ON rd.RoleId = rl.Id 
      LEFT OUTER JOIN Modules md ON rm.moduleId = md.Id
      WHERE emp.UserId= ${req.user.UserId}`);
    console.log("data====", data);
    let result = [];
    let tempResult = [];
    data.forEach(({ ModuleName, Parent, Routes, addeditallowed }) => {
      tempResult.push({ addeditallowed, Routes, ModuleName });
      if (Parent) {
        Parent &&
          Parent.split(".")
            .reduce((level, module) => {
              var temp = level.find((o) => o.module === module);
              if (!temp) {
                level.push((temp = { module, type: "collapse", route: "#" }));
              }
              return (temp.sub_menu = temp.sub_menu || []);
            }, result)
            .push({
              module: ModuleName,
              route: Routes,
              type: "item",
              addeditallowed: addeditallowed,
            });
      } else {
        result.push({
          module: ModuleName,
          route: Routes,
          type: "item",
          addeditallowed: addeditallowed,
        });
      }
    });
    // let routes = [];
    // data.map((value) => {
    //   let index = portalRoutes.findIndex(
    //     (val) => val.module == value.ModuleName
    //   );
    //   let index2 = routes.findIndex((val) => val.module == value.ModuleName);
    //   if (index > -1) {
    //     if (index2 == -1) {
    //       routes.push({
    //         ...portalRoutes[index],
    //         moduleId: value.ModuleId,
    //         role: value.RoleName,
    //         roleId: value.RoleId,
    //         allowaddedit: value.addeditallowed,
    //       });
    //     } else {
    //       if (!routes[index2].role.includes(value.RoleName)) {
    //         routes[index2].role = routes[index2].role + `,${value.RoleName}`;
    //       }

    //       if (value.addeditallowed == true && !routes[index2].allowaddedit) {
    //         routes[index2].allowaddedit = true;
    //       }
    //     }
    //   }
    // });
    successResponse(req, res, {
      error: false,
      data: result,
      data2: tempResult,
    });
  } catch (error) {
    errorResponse(req, res, { error: true, message: error.message });
  }
};
const add_roles = async (req, res, next) => {
  try {
    const { name } = req.body;
    let query = `INSERT INTO Roles(name) VALUES('${name}')`;
    spoc(query, false, function (err, result) {
      if (err) {
        next(err);
      } else {
        successResponse(req, res, {
          error: false,
          message: "Roles added successsfully",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};
const get_roles = (req, res, next) => {
  try {
    let query = `select * from roles;`;

    spoc(query, false, function (err, data) {
      console.log("data====", data);
      if (err) {
        next(err);
      } else {
        successResponse(req, res, { error: false, data });
      }
    });
    console.log("query====", query);
  } catch (error) {
    console.log("error==1", error);
    next(error);
  }
};
const get_modules = (req, res, next) => {
  try {
    let query = `select * from modules;`;

    spoc(query, false, function (err, data) {
      console.log("data====", data);
      if (err) {
        next(err);
      } else {
        successResponse(req, res, { error: false, data });
      }
    });
    console.log("query====", query);
  } catch (error) {
    console.log("error==1", error);
    next(error);
  }
};
const add_modules = async (req, res, next) => {
  try {
    const { name, parent, routes } = req.body;
    let query = `INSERT INTO Modules(Name,Parent,Routes) VALUES('${name}','${parent}','${routes}')`;
    spoc(query, false, function (err, result) {
      if (err) {
        next(err);
      } else {
        successResponse(req, res, {
          error: false,
          message: "Modules added successfully",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};
const assign_role_modules = async (req, res, next) => {
  try {
    const { roleId, moduleId, addeditallowed = false } = req.body;
    let query = `INSERT INTO RoleModules(RoleId,moduleId,addeditallowed) VALUES('${roleId}','${moduleId}',${addeditallowed})`;
    let data = await spoc(query);
    successResponse(req, res, {
      error: false,
      message: "Modules assigned to Role successfully",
    });
  } catch (error) {
    next(error);
  }
};
const delete_roles = (req, res, next) => {
  try {
    let query = `DELETE FROM Roles WHERE id=${req.body.id}`;

    spoc(query, false, function (err, data) {
      if (err) {
        next(err);
      } else {
        successResponse(req, res, {
          error: false,
          message: "Roles deleted successfully",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Edit Role
 * @param {id,name} req.body
 */
const edit_role = async (req, res, next) => {
  try {
    const { id, name } = req.body;
    let query = `UPDATE  Roles SET name='${name}' where id=${id}`;
    spoc(query, false, function (err, result) {
      if (err) {
        next(err);
      } else {
        successResponse(req, res, {
          error: false,
          message: "Role updated succesfully",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  login,
  signup,
  assignRoles,
  getRoleRoutes,
  add_roles,
  add_modules,
  assign_role_modules,
  get_roles,
  delete_roles,
  edit_role,
  get_modules,
};
