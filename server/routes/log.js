import express from "express";
import Log from "../models/Log.js";

const logRoutes = express.Router();

// CREATE
logRoutes.route("/add").post( (req, response) => {
  const logObj = {
    date: req.body.date,
    exercise: req.body.exercise,
    weight: req.body.weight,
    reps: req.body.reps,
    form: req.body.form
  };

  Log.create(logObj, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// READ
// Get all logs
logRoutes.route("/list").get( (req, response) => {
  Log
    .find({})
    .toArray( (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

//Get one log
logRoutes.route("/:id").get( (req, response) => {
  Log.findById(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// UPDATE
logRoutes.route("/update/:id").post( (req, response) => {
  const newValues = {
    $set: {
      date: req.body.date,
      exercise: req.body.exercise,
      weight: req.body.weight,
      reps: req.body.reps,
      form: req.body.form
    }
  };

  Log.findByIdAndUpdate(req.params.id, newValues, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// DELETE
logRoutes.route("/delete/:id").delete( (req, response) => {
  Log.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});


export default logRoutes;