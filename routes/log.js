import express from "express";
import Log from "../models/Log.js";

const logRoutes = express.Router();

// CREATE
// USED
logRoutes.route("/add").post( (req, res) => {
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
      res.status(500).json({
        message: "Failed to create log",
      }); 
    }
    res.status(200).json({
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
// USED
logRoutes.route("/exercise/:exercise").get( (req, res) => {
  Log.find({ exercise: req.params.exercise,
    user: req.user.id }, (err, result) => {
    if (err) {
      console.error("Error fetching logs for that exercise and date: ", err);
      res.status(500).json({
        message: "Failed to fetch logs"
      });
    }
    res.status(200).json({
      message: "Successfully found logs",
      data: result,
    });
  });
});

// UPDATE
// USED
logRoutes.route("/update/:id").post( (req, res) => {
  const newValues = {
    $set: {
      weight: req.body.weight,
      reps: req.body.reps,
      form: req.body.form,
    }
  };

  Log.findByIdAndUpdate(
    req.params.id, 
    newValues,
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        console.error("Error updating log: ", err);
        res.status(500).json({
          message: "Failed to update log"
        });
      }
      res.status(200).json({
        message: "Successfully updated log",
        data: result,
      });
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