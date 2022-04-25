const HomepageRoute = require("./home");
const UsersRoute = require("./users");
const EmployeeRoute = require("./employee");
const BusinessesRoute = require("./businesses");

const constructorMethod = (app) => {
  app.use("/", UsersRoute);
  app.use("/home", HomepageRoute);
  app.use("/employee", EmployeeRoute);
  app.use("/businesses", BusinessesRoute);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "this route is not being used" });
  });
};

module.exports = constructorMethod;
