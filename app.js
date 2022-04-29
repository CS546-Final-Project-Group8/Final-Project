const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({
    name: "AuthCookie",
    secret: "secret to bcrypt password",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 600000 },
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MIDDLEWARE CODE STARTS HERE

// MIDDLEWARE CODE ENDS HERE

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var hbs = exphbs.create({});

hbs.handlebars.registerHelper("if_eq", function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});
