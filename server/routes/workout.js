import express from "express";
import Workout from "../models/Workout.js";

const workoutRoutes = express.Router();

// CREATE
workoutRoutes.route("/add").post( (req, response) => {
  const workoutObj = {
    user: req.body.user,
    date: req.body.date,
    log_list: []
  };

  Workout.create(workoutObj, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// READ
// Get all workouts
workoutRoutes.route("/list").get((req, response) => {
  Workout
    .find({})
    .toArray( (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

// Get one workout
workoutRoutes.route("/:id").get( (req, response) => {
  Workout.findById(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// UPDATE
// Edit user, date
workoutRoutes.route("/update/:id").post( (req, response) => {
  const newValues = {
    $set: {
      user: req.body.user,
      date: req.body.date,
    }
  };

  Workout.findByIdAndUpdate(req.params.id, newValues, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// Add log to log_list
workoutRoutes.route("/add-log/:id").post( (req, response) => {
  Workout.findByIdAndUpdate(req.params.id, {
    $push: {
      log_list: req.body.log
    }
  }, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// Delete log from log_list
workoutRoutes.route("/del-log/:id").post( (req, response) => {
  Workout.findByIdAndUpdate(req.params.id, {
    $pull: {
      log_list: req.body.log
    }
  }, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// DELETE
workoutRoutes.route("/delete/:id").delete( (req, response) => {
  Workout.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});


export default workoutRoutes;

