import Exercise from "../models/Exercise.js";
import express from "express";

const exerciseRoutes = express.Router();

// CREATE
// exerciseRoutes.route("/add").post( (req, response) => {
//   const routeObj = {
//     name: req.body.name,
//     description: req.body.description,
//     token: req.body.token,
//     muscle_group: req.body.muscle_group,
//     user_created: true,
//     user: req.user.id,
//   };

//   Exercise.create(routeObj, (err, result) => {
//     if (err) throw err;
//     response.json(result);
//   });
// });

// READ
// Get all exercises
exerciseRoutes.route("/list/all").get((req, res) => {
  Exercise.find({}, (err, result) => {
    if (err) {
      console.error("Error fetching exercises: ", err);
      res.status(500).json({
        message: "Failed to fetch exercises.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched exercises",
      data: result,
    });
  });
});

// GET ab exercises
exerciseRoutes.route("/list/abs").get((req, res) => {
  Exercise.find({ primaryMuscles: "abdominals" }, (err, result) => {
    if (err) {
      console.error("Error fetching exercises: ", err);
      res.status(500).json({
        message: "Failed to fetch exercises.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched exercises",
      data: result,
    });
  });
});

// GET arm exercises
exerciseRoutes.route("/list/arms").get((req, res) => {
  Exercise.find(
    {
      $or: [
        { primaryMuscles: "biceps" },
        { primaryMuscles: "triceps" },
        { primaryMuscles: "forearms" },
      ],
    },
    (err, result) => {
      if (err) {
        console.error("Error fetching exercises: ", err);
        res.status(500).json({
          message: "Failed to fetch exercises.",
        });
      }
      res.status(200).json({
        message: "Successfully fetched exercises",
        data: result,
      });
    }
  );
});

// GET back exercises
exerciseRoutes.route("/list/back").get((req, res) => {
  Exercise.find(
    {
      $or: [
        { primaryMuscles: "lower back" },
        { primaryMuscles: "traps" },
        { primaryMuscles: "middle back" },
        { primaryMuscles: "lats" },
      ],
    },
    (err, result) => {
      if (err) {
        console.error("Error fetching exercises: ", err);
        res.status(500).json({
          message: "Failed to fetch exercises.",
        });
      }
      res.status(200).json({
        message: "Successfully fetched exercises",
        data: result,
      });
    }
  );
});

// GET chest exercises
exerciseRoutes.route("/list/chest").get((req, res) => {
  Exercise.find({ primaryMuscles: "chest" }, (err, result) => {
    if (err) {
      console.error("Error fetching exercises: ", err);
      res.status(500).json({
        message: "Failed to fetch exercises.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched exercises",
      data: result,
    });
  });
});

// GET shoulder exercises
exerciseRoutes.route("/list/shoulders").get((req, res) => {
  Exercise.find({ primaryMuscles: "shoulders" }, (err, result) => {
    if (err) {
      console.error("Error fetching exercises: ", err);
      res.status(500).json({
        message: "Failed to fetch exercises.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched exercises",
      data: result,
    });
  });
});

// GET leg exercises
exerciseRoutes.route("/list/legs").get((req, res) => {
  Exercise.find(
    {
      $or: [
        { primaryMuscles: "quadriceps" },
        { primaryMuscles: "calves" },
        { primaryMuscles: "glutes" },
        { primaryMuscles: "hamstrings" },
        { primaryMuscles: "adductors" },
        { primaryMuscles: "abductors" },
      ],
    },
    (err, result) => {
      if (err) {
        console.error("Error fetching exercises: ", err);
        res.status(500).json({
          message: "Failed to fetch exercises.",
        });
      }
      res.status(200).json({
        message: "Successfully fetched exercises",
        data: result,
      });
    }
  );
});

// GET cardio exercises
exerciseRoutes.route("/list/cardio").get((req, res) => {
  Exercise.find({ category: "cardio" }, (err, result) => {
    if (err) {
      console.error("Error fetching exercises: ", err);
      res.status(500).json({
        message: "Failed to fetch exercises.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched exercises",
      data: result,
    });
  });
});

// GET stretching exercises
exerciseRoutes.route("/list/stretch").get((req, res) => {
  Exercise.find({ category: "stretching" }, (err, result) => {
    if (err) {
      console.error("Error fetching exercises: ", err);
      res.status(500).json({
        message: "Failed to fetch exercises.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched exercises",
      data: result,
    });
  });
});

// Get one exercise
exerciseRoutes.route("/:id").get((req, response) => {
  Exercise.findById(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// // UPDATE
// exerciseRoutes.route("/update/:id").post( (req, response) => {
//   const newValues = {
//     $set: {
//       name: req.body.name,
//       description: req.body.description,
//       token: req.body.token,
//       muscle_group: req.body.muscle_group,
//     }
//   };

//   Exercise.findByIdAndUpdate(
//     req.params.id,
//     newValues,
//     { returnOriginal: false },
//     (err, result) => {
//       if (err) throw err;
//       response.json(result);
//     });
// });

// // DELETE
// exerciseRoutes.route("/delete/:id").delete( (req, response) => {
//   Exercise.findByIdAndDelete(req.params.id, {}, (err, result) => {
//     if (err) throw err;
//     response.json(result);
//   });
// });

export default exerciseRoutes;
