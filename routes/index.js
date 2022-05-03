const HomepageRoute = require("./home");
const UsersRoute = require("./users");
const ManagerRoute = require("./manager");
const BusinessesRoute = require("./businesses");

const constructorMethod = (app) => {
  app.use("/", UsersRoute);
  app.use("/home", HomepageRoute);
  app.use("/manager", ManagerRoute);
  app.use("/businesses", BusinessesRoute);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "this route is not being used" });
  });
};

module.exports = constructorMethod;
