// Do require routes here

const constructorMethod = (app) => {
  // write your routing code here

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
