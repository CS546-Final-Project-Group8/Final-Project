const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({
    name: "AuthCookie",
    secret: "secret to bcrypt password",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 40000 },
  })
);

const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MIDDLEWARE CODE STARTS HERE

// MIDDLEWARE CODE ENDS HERE

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});
