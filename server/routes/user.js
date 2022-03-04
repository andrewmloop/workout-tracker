import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

const userRoutes = express.Router();

// CREATE
userRoutes.route("/add").post( (req, response) => {
  bcrypt.genSalt(10, (saltErr, salt) => {
    if (saltErr) throw saltErr;
    bcrypt.hash(req.body.password, salt, (hashErr, hash) => {
      if (hashErr) throw hashErr;

      const userObj = {
        email: req.body.email,
        password: hash,
        first_name: req.body.first_name,
        birth_date: req.body.birth_date,
      };

      User.create(userObj, (userErr, result) => {
        if (userErr) throw userErr;
        response.json(result);
      });
    });
  });
});

// READ
// Get one user
userRoutes.route("/:id").get( (req, response) => {
  User.findById(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// UPDATE
userRoutes.route("/update/:id").post( (req, response) => {
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
    req.params.id, 
    newValues, 
    { returnOriginal: false },
    (err, result) => {
      if (err) throw err;
      response.json(result);
    });
});

// Delete
userRoutes.route("/delete/:id").delete( (req, response) => {
  User.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});


export default userRoutes;