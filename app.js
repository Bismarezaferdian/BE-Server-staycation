var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
//
//
// import mongoose
// const moongoose = require("mongoose");
// moongoose.connect("mongodb://localhost:27017/db-bwamern");
const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/db-bwamern", {
mongoose.connect(
  "mongodb+srv://websitemuid:admin@cluster0.3iiwa.mongodb.net/db_staycation?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  }
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
//router admin
const adminRouter = require("./routes/admin");
//router api
const apiRouter = require("./routes/api");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    maxAge: Date.now() + 30 * 86400 * 1000,
    // cookie: { maxAge: 6000000 },
  })
);
app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
//admin
app.use("/admin", adminRouter);
//api router
app.use("/api/v1/member", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
