import "dotenv/config.js";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cors from "cors";

import routes from "./routes/index.js";

// ENV variables
const port = process.env.PORT || 9900;
const mongoDB = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

// Set up Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token");
  next();
});

// Set up MongoDB connection
mongoose.connect(mongoDB, { useNewURLParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error."));

// Serve client
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

// Set up routing
app.use("/api/exercise", verifyJWT, routes.exerciseRoutes);
app.use("/api/log", verifyJWT, routes.logRoutes);
app.use("/api/routine", verifyJWT, routes.routineRoutes);
app.use("/api/user", verifyJWT, routes.userRoutes);
app.use("/api/auth", routes.authRoutes);

// Listening
app.listen(port, () => {
  console.log("App is listening at port: " + port);
});


// MIDDLEWARE FUNCTIONS
function verifyJWT(req, res, next) {
  // Strips "Bearer" off "Bearer <token>" in request header
  const token = req.headers["x-access-token"].split(" ")[1];

  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) return res.status(401).json({
        result: "failure",
        message: "Failed to authenticate",
        isLoggedIn: false,
      });
      req.user = {};
      req.user.id = decoded.id;
      req.user.email = decoded.email;
      next();
    });
  } else {
    res.status(401).json({
      result: "failure",
      message: "Incorrect token given", 
      isLoggedIn: false 
    });
  }
}