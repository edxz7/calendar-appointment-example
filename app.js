// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars.
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "aimgur";
hbs.registerPartials(__dirname + '/views/partials');
app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
const appointmentRoutes = require('./routes/appointment.routes');
const calendarRoutes = require("./routes/calendar.routes");
const ownerRoutes = require('./routes/owner.routes');
const isUser = require("./middleware/isUser");
const isLoggedIn = require("./middleware/isLoggedIn");
const isAdmin = require("./middleware/isAdmin");
app.use("/auth", authRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/calendar",isLoggedIn, isAdmin, calendarRoutes);
app.use("/owner", isLoggedIn, isUser, ownerRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;