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
    maxRep: req.body.maxRep,
    form: req.body.form,
    user: req.user.id,
  };

  Log.create(logObj, (err, result) => {
    if (err) {
      console.error("Error creating log: ", err);
      response.json({
        result: "failure",
        message: "Failed to create log",
      }); 
    }
    response.json({
      result: "success",
      message: "Successfully created log",
      data: result,
    });
  });
});

// READ
// Get all logs for a user
logRoutes.route("/list").get( (req, response) => {
  Log.find({ user: req.user.id }, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// Get one log
logRoutes.route("/:id").get( (req, response) => {
  Log.findById(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// Get logs for exercise for most recent date
logRoutes.route("/exercise/:exercise").get( (req, response) => {
  Log.find({ exercise: req.params.exercise,
    user: req.user.id }, (err, result) => {
    if (err) {
      console.error("Error fetching logs for that exercise and date: ", err);
      response.json({
        result: "failure",
        message: "Failed to fetch log."
      });
    }
    response.json({
      result: "success",
      message: "Successfully found logs.",
      data: result,
    });
  }).sort({ date: -1 });
});

// UPDATE
logRoutes.route("/update/:id").post( (req, response) => {
  const newValues = {
    $set: {
      date: req.body.date,
      exercise: req.body.exercise,
      weight: req.body.weight,
      reps: req.body.reps,
      form: req.body.form,
      user: req.body.user,
    }
  };

  Log.findByIdAndUpdate(
    req.params.id, 
    newValues,
    { returnOriginal: false },
    (err, result) => {
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