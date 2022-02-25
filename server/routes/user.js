import express from "express"
import User from "../models/User";

const userRoutes = express.Router();

// CREATE
userRoutes.route("/user/add").post( (req, response) => {
  const userObj = {
    email: req.body.email,
    password: req.body.email,
    first_name: req.body.first_name,
    birth_date: req.body.birth_date,
  };

  User.create(userObj, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// READ
// Get one user
userRoutes.route("/user/:id").get( (req, response) => {
  User.findById(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// UPDATE
userRoutes.route("/user/update/:id").post( (req, response) => {
  const newValues = {
    $set: {
      email: req.body.email,
      password: req.body.email,
      first_name: req.body.first_name,
      birth_date: req.body.birth_date,
      left_hand: req.body.left_hand,
      use_metric: req.body.use_metric
    }
  };

  User.findByIdAndUpdate(req.params.id, newValues, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});

// Delete
userRoutes.route("/user/delete/:id").delete( (req, response) => {
  User.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) throw err;
    response.json(result);
  });
});


export default userRoutes;