require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

//connect to databank
mongoose.Promise = Promise;
mongoose
  .connect(
    "mongodb://localhost/heyneigh",
    { useMongoClient: true }
  )
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

//configure session
app.use(
  session({
    secret: "heyneigh",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000000 }, //1000min
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

//checks if there is a session
app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }

  next();
});

// default value for title local
app.locals.title = "Hey Neigh! - Make friends around the corner";

//link to routes
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const editRoute = require("./routes/edit");
app.use("/", editRoute);

const aboutRoute = require("./routes/about");
app.use("/", aboutRoute);

const profileRoute = require("./routes/profile");
app.use("/", profileRoute);

const addPostRoute = require("./routes/add-post");
app.use("/", addPostRoute);

const addCommentRoute = require("./routes/add-comment");
app.use("/", addCommentRoute);

module.exports = app;
