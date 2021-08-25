"use strict";

const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  path = require("path"),
  passport = require("passport"),
  expressSession = require("express-session"),
  connectFlash = require("connect-flash"),
  User = require("./models/user");


const fileUpload = require('express-fileupload');

// App Settings
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(layouts);
app.use(express.urlencoded({ extended: true }));
app.use(
	methodOverride("_method", {
	  methods: ["POST", "GET"]
	})
  );
app.use(express.json());
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

// Database Connection
mongoose.connect(
    "mongodb+srv://dbUser:dbUserPassword@gettingstarted.jauwg.mongodb.net/mustacchio?retryWrites=true&w=majority",  // Replace with Atlas connection string
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(connectFlash());

app.use((req, res, next) => {
	res.locals.loggedIn = req.isAuthenticated();
	res.locals.currentUser = req.user;
	res.locals.flashMessages = req.flash();
	next();
});

// default options
app.use(fileUpload());

app.use("/", router);
 
// Start server
app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}/index`);
  });