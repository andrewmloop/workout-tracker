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
exerciseRoutes.route("/list").get( (req, response) => {
  Exercise
    .find({}, (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

// Get one exercise
exerciseRoutes.route("/:id").get( (req, response) => {
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