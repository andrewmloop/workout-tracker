import express from "express";
import Workout from "../models/Workout";

const workoutRoutes = express.Router();

// CREATE
workoutRoutes.route("/workout/add").post( (req, response) => {
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
workoutRoutes.route("/workouts").get((req, response) => {
  Workout
    .find({})
    .toArray( (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

// Get one workout
workoutRoutes.route("/workout/:id").get( (req, response) => {
  Workout.findById(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// UPDATE
// Edit user, date
workoutRoutes.route("/workout/update/:id").post( (req, response) => {
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
workoutRoutes.route("/workout/add-log/:id").post( (req, response) => {
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
workoutRoutes.route("/workout/del-log/:id").post( (req, response) => {
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
workoutRoutes.route("/workout/delete/:id").delete( (req, response) => {
  Workout.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});


export default workoutRoutes;

