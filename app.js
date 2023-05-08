const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { store } = require("./utils/mongoStore");

const app = express();

//Setting PUG engine & serving static folder
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//SESSION COOKIE és store
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: store,
//   })
// );

//PROTECTION
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ["cim"],
  })
);
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//COOKIE log
app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

//ROUTER-ek meghívása
const viewRouter = require("./routers/viewRouter");
const felhasznaloRouter = require("./routers/felhasznaloRouter");
const termekRouter = require("./routers/termekRouter");
const rendelesRouter = require("./routers/rendelesRouter");

//ROUTES
app.use("/", viewRouter);
app.use("/api/v1/users", felhasznaloRouter);
app.use("/api/v1/termekek", termekRouter);
app.use("/api/v1/rendeles", rendelesRouter);
module.exports = app;
