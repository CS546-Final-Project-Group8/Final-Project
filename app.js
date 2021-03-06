const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({
    name: "AuthCookie",
    secret: "4kAQJRzpPSJ27pttoqejyh8RsjfMFEJXeGqBCL5p4ow4HkszhbXjux8kWWr9BYpC",
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
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

var hbs = exphbs.create({});

hbs.handlebars.registerHelper("dateFormat", require("handlebars-dateformat"));
hbs.handlebars.registerHelper("if_eq", function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

hbs.handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

// middleware to check if user is admin for /manager route
app.use("/manager", (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect("/home");
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});
