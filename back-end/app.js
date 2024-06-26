const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const authRoter = require("./moduls/auth/auth.routes");
const homeRouter = require("./moduls/home/home.routes");
const movieRoter = require("./moduls/movies/movie.routes");
const { setHeaders } = require("./middleware/setHeader");
const errorHandller = require("./middleware/errorHandller");

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

// cookie Parser
app.use(cookieParser());

//express Flash and Sessions
app.use(
  session({
    secret: process.env.Secret_Sessions,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Set Header (cors Policy)
app.use(setHeaders);

// Views Folder
const frontendPath = path.join(__dirname, "..", "front-end");
app.use(express.static(frontendPath));
app.set("views", frontendPath);
app.set("view engine", "html");

// Routes
app.use("/", homeRouter);
app.use("/auth", authRoter);
app.use("/movies", movieRoter);

//Not Found Routes
app.all("*", (req, res, next) => {
  const err = new Error(`cant find ${req.originalUrl} routes in server`);
  err.statusCode = 404;
  err.status = "faild";

  return next(err);
});

//Error Handler
app.use(errorHandller);

module.exports = app;
