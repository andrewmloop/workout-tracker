import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import models from "./models/index.js";

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

// Listening
app.listen(port, () => {
  console.log("App is listening at port: " + port);
});

console.log(models.User.find({ email: "email@email.com" }));

models.User.create({
  email: "email@email.com",
  password: "password",
  first_name: "Test",
  birth_date: "1996-03-29"
}, (err) => {
  if (err) console.log(err);
});