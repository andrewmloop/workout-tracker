import express from "express";
import Routine from "../models/Routine.js";

const routineRoutes = express.Router();

// CREATE
routineRoutes.route("/add").post( (req, response) => {
  const routeObj = {
    exercise_list: [],
    user: req.user.id,
    name: req.body.name
  };

  Routine.create(routeObj, (err, result) => {
    if (err) {
      console.error("Failed to create routine: ", err);
      response.json({
        result: "failure",
        message: "Failed to create routine",
      });
    } else {
      response.json({
        result: "success",
        message: "Successfully created routine",
        data: result,
      });
    }
  });
});

// READ
// Get all routines for a user
routineRoutes.route("/list").get( (req, response) => {
  Routine.find({ user: req.user.id }, (err, result) => {
    if (err) throw err;
    response.json(result);
  }).sort({ name: 1 }).collation({ locale: "en", caseLevel: true});
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

  Routine.findByIdAndUpdate(
    req.params.id, 
    newValues, 
    { returnOriginal: false },
    (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

// Add exercise to list
routineRoutes.route("/add-exercise/:id").post( (req, response) => {
  Routine.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        exercise_list: {
          exercise: req.body.exercise,
          target_sets: req.body.target_sets,
          target_reps: req.body.target_reps,
        }
      }
    },
    { returnOriginal: false },
    (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

// Delete exercise from list
routineRoutes.route("/del-exercise/:id").post( (req, response) => {
  Routine.findByIdAndUpdate(
    req.params.id, 
    {
      $pull: {
        exercise_list: {
          _id: req.body.exercise_list_id,
        }
      }
    },
    { 
      returnOriginal: false, 
      safe: true,
      multi: true,
    },
    (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

// Update exercise in list
routineRoutes.route("/upd-exercise/:id").post( (req, response) => {
  const newValues = {
    $set: {
      "exercise_list.$.exercise": req.body.exercise,
      "exercise_list.$.target_sets": req.body.target_sets,
      "exercise_list.$.target_reps": req.body.target_reps,
    }
  };
  
  Routine.updateOne(
    {
      _id: req.params.id, 
      exercise_list: 
        { $elemMatch: 
          {_id: req.body.exercise_list_id }
        }
    },
    newValues,
    { returnOriginal: false },
    (err, result) => {
      if (err) throw err;
      response.json(result);
    }
  );
});

// DELETE
routineRoutes.route("/delete/:id").delete( (req, response) => {
  Routine.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      console.error("Failed to create routine: ", err);
      response.json({
        result: "failure",
        message: "Failed to delete routine",
      });
    } else {
      response.json({
        result: "success",
        message: "Successfully deleted routine",
        data: result,
      });
    }
  });
});


export default routineRoutes;