import express from "express";

import User from "../models/User.js";

const userRoutes = express.Router();

// CREATE handled by Auth route

// READ
// Get one user
userRoutes.route("/:id").get( (req, res) => {
  User.findById(req.params.id, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// UPDATE
// USED
userRoutes.route("/update").post( (req, res) => {
  const newValues = {
    $set: {
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      birth_date: req.body.birth_date,
      left_hand: req.body.left_hand,
      use_metric: req.body.use_metric
    }
  };

  User.findByIdAndUpdate(
    req.user.id, 
    newValues, 
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        console.error("Error updating user: ", err);
        return res.status(500).json({
          message: "Failed to update user",
        });
      }
      res.status(200).json({
        message: "Updated user",
        data: result,
      });
    });
});

// DELETE
userRoutes.route("/delete/:id").delete( (req, response) => {
  User.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

export default userRoutes;