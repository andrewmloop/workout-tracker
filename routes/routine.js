import express from "express";
import Routine from "../models/Routine.js";

const routineRoutes = express.Router();

// CREATE
// USED
routineRoutes.route("/add").post( (req, res) => {
  const routeObj = {
    exercise_list: [],
    user: req.user.id,
    name: req.body.name
  };

  Routine.create(routeObj, (err, result) => {
    if (err) {
      console.error("Failed to create routine: ", err);
      res.status(500).json({
        message: "Failed to create routine",
      });
    } else {
      res.status(200).json({
        message: "Successfully created routine",
        data: result,
      });
    }
  });
});

// READ
// Get all routines for a user
// USED
routineRoutes.route("/list").get( (req, res) => {
  Routine.find({ user: req.user.id }, (err, result) => {
    if (err) {
      console.error("Failed to fetch routines: ", err);
      res.status(500).json({
        message: "Failed to reorder routine",
      });
    } else {
      res.status(200).json({
        message: "Successfully added exercises",
        data: result,
      });
    }
  }).sort({ name: 1 }).collation({ locale: "en", caseLevel: true}).populate("exercise_list.exercise");
});

// Get one routine
// routineRoutes.route("/:id").get( (req, response) => {
//   Routine.findById(req.params.id, (err, result) => {
//     if (err) throw err;
//     response.json(result);
//   });
// });

// UPDATE
// Update name, user for routine
// routineRoutes.route("/update/:id").post( (req, response) => {
//   const newValues = {
//     $set: {
//       user: req.body.user,
//       name: req.body.name,
//     }
//   };

//   Routine.findByIdAndUpdate(
//     req.params.id, 
//     newValues, 
//     { returnOriginal: false },
//     (err, result) => {
//       if (err) throw err;
//       response.json(result);
//     });
// });

// Update exercise_list order
// Used
routineRoutes.route("/upd-list/:id").post( (req, res) => {
  Routine.findByIdAndUpdate(
    req.params.id,
    {
      exercise_list: req.body.newList
    },
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        console.error("Failed to reorder routine: ", err);
        res.status(500).json({
          message: "Failed to reorder routine",
        });
      } else {
        res.status(200).json({
          message: "Successfully added exercises",
          data: result,
        });
      }
    }
  );
});

// Add exercise to list
// routineRoutes.route("/add-exercise/:id").post( (req, response) => {
//   Routine.findOneAndUpdate(
//     { _id: req.params.id },
//     {
//       $push: {
//         exercise_list: {
//           exercise: req.body.exercise,
//         }
//       }
//     },
//     { returnOriginal: false },
//     (err, result) => {
//       if (err) throw err;
//       response.json(result);
//     });
// });

// Delete exercise from list
// USED
routineRoutes.route("/del-exercise/:id").post( (req, res) => {
  Routine.findByIdAndUpdate(
    req.params.id, 
    {
      $pull: {
        exercise_list: {
          exercise: req.body.exercise_list_id
        }
      }
    },
    { 
      returnOriginal: false,
      safe: true,
      multi: true,
    },
    (err, result) => {
      if (err) {
        console.error("Failed to delete exercise: ", err);
        res.status(500).json({
          message: "Failed to delete exercise",
        });
      } else {
        res.status(200).json({
          message: "Successfully deleted exercise",
          data: result,
        });
      }
    });
});

// Update exercise in list
// USED
routineRoutes.route("/upd-routine/:id").post( (req, res) => {
  const newExercises = req.body.newExercises.map( id => {
    return { exercise: id };
  });

  Routine.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: {
        exercise_list: {
          $each: newExercises
        }
      }
    },
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        console.error("Failed to add exercises: ", err);
        res.status(500).json({
          message: "Failed to add exercises",
        });
      } else {
        res.status(200).json({
          message: "Successfully added exercises",
          data: result,
        });
      }
    }
  );
});

// Update routine exercise target sets and reps
// USED
routineRoutes.route("/upd-targets/:id").post( (req, res) => {
  Routine.findOneAndUpdate(
    { 
      _id: req.params.id, 
      exercise_list: {
        $elemMatch: {exercise: req.body.exerciseId}
      }
    },
    {
      $set: {
        "exercise_list.$.targSets": req.body.targSets,
        "exercise_list.$.targReps": req.body.targReps,
      }
    },
    {
      new: true,
      safe: true,
      upsert: true
    },
    (err, result) => {
      if (err) {
        console.error("Failed to set targets: ", err);
        res.status(500).json({
          message: "Failed to set targets",
        });
      } else {
        res.status(200).json({
          message: "Successfully set targets",
          data: result,
        });
      }
    }
  );
});

// DELETE
// USED
routineRoutes.route("/delete/:id").delete( (req, res) => {
  Routine.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      console.error("Failed to delete routine: ", err);
      res.status(500).json({
        message: "Failed to delete routine",
      });
    } else {
      res.status(200).json({
        message: "Successfully deleted routine",
        data: result,
      });
    }
  });
});


export default routineRoutes;