import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import routes from "./routes/index.js";

// ENV variables
const port = process.env.PORT;
const mongoDB = process.env.MONGO_URI;
console.log(port);
console.log(mongoDB);

// Set up Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Set up MongoDB connection
mongoose.connect(mongoDB, { useNewURLParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error."));

// Set up routing
app.use("/exercise", routes.exerciseRoutes);
app.use("/log", routes.logRoutes);
app.use("/routine", routes.routineRoutes);
app.use("/user", routes.userRoutes);
app.use("/workout", routes.workoutRoutes);

// Listening
app.listen(port, () => {
  console.log("App is listening at port: " + port);
});

// models.User.create({
//   email: "email@email.com",
//   password: "password",
//   first_name: "Test",
//   birth_date: "1996-03-29"
// }, (err) => {
//   if (err) console.log(err);
// });