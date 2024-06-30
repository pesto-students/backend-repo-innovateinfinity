// import './config/instrument.mjs';

import * as Sentry from "@sentry/node";
import Express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import DriverHandler from "./handlers/DriverHandler.js";
import OrganizationHandler from "./handlers/OrganizationHandler.js";
import AuthHandler from "./handlers/AuthHandler.js";
import AdminHandler from "./handlers/AdminHandler.js";

dotenv.config();

import("./config/instrument.js")
  .then(() => {
    console.log("Instrument module loaded");
  })
  .catch((err) => {
    console.error("Failed to load instrument module", err);
  });


const app = Express();

const port = process.env.PORT || 4000;

const appName = "IDrive API";

const mongoUrl =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_PROD
    : process.env.MONGODB_TEST;

//mongoose connection
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("MongoDB connected successfully");
});

app.use(Express.json({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, baggage, sentry-trace, Accept, Authorization,Content-Disposition, x-auth-token"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST, PUT, DELETE, OPTIONS, PATCH"
  );
  if (req.method === "OPTIONS") {
    return res.send();
  }
  next();
});

app.use("/api/auth", AuthHandler);
app.use("/api/driver", DriverHandler);
app.use("/api/organization", OrganizationHandler);
app.use("/api/admin", AdminHandler);

app.get("/*", async (req, res) => {
  Sentry.captureException(new Error("route not found"));
  return res.status(404).json({ msg: "route not found" });
});

Sentry.setupExpressErrorHandler(app);

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
  console.log(`${appName} listening on port ${port}`);
});
