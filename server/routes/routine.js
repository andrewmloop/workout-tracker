import express from "express";
import Routine from "../models/Routine.js";

const routineRoutes = express.Router();

// CREATE
routineRoutes.route("/add").post( (req, response) => {
  const routeObj = {
    exercise_list: [],
    user: req.body.user,
    name: req.body.name
  };

  Routine.create(routeObj, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// READ
// Get all routines
routineRoutes.route("/list").get( (req, response) => {
  Routine
    .find({})
    .toArray( (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

// Get one routine
routineRoutes.route("/:id").get( (req, response) => {
  Routine.findById(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// UPDATE
// Update name, user for routine
routineRoutes.route("/update/:id").post( (req, response) => {
  const newValues = {
    $set: {
      user: req.body.user,
      name: req.body.name,
    }
  };

  Routine.findByIdAndUpdate(req.params.id, newValues, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// Add exercise to list
routineRoutes.route("/add-exercise/:id").post( (req, response) => {
  const routine = Routine.findById(req.params.id, (err) => {
    if (err) throw err;
  });

  Routine.findByIdAndUpdate(routine._id, {
    $push: {
      exercise_list: req.body.exercise,
    }
  }, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// Delete exercise from list
routineRoutes.route("/del-exercise/:id").post( (req, response) => {
  const routine = Routine.findById(req.params.id, (err) => {
    if (err) throw err;
  });

  Routine.findByIdAndUpdate(routine._id, {
    $pull: {
      exercise_list: req.body.exercise,
    }
  }, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// DELETE
routineRoutes.route("/delete/:id").delete( (req, response) => {
  Routine.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});


export default routineRoutes;