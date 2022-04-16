const HomepageRoute = require("./homepage");
const UsersRoute = require("./users");

const constructorMethod = (app) => {
  app.use("/home", HomepageRoute);
  app.use("/", UsersRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "this route is not being used" });
  });
};

module.exports = constructorMethod;
