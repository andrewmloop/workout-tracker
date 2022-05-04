import express from "express";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const authRoutes = express.Router();
const JWTSecret = process.env.JWT_SECRET;

// Register
authRoutes.route("/register").post( async (req, response) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.first_name;

  const takenEmail = await User.findOne({ email: email });

  if (takenEmail) {
    response.json({ 
      result: "failure",
      message: "Email already in use.",
    });
  } else {
    const hash = await bcrypt.hash(password, 10);
    
    const newUser = {
      email: email,
      password: hash,
      first_name: firstName,
    };
  
    User.create(newUser, (userErr, result) => {
      if (userErr) {
        response.json({
          result: "failure",
          message: "Failed to create new user"
        });
      } else {
        response.json({ 
          result: "success",
          message: "New user created.",
          data: result,
        });
      }
    });
  }
});

// Login
authRoutes.route("/login").post( async (req, response) => {
  const user = req.body;

  try {
    const foundUser = await User.findOne({ email: user.email });

    if (!foundUser) {
      return response.json({ 
        result: "failure",
        message: "Invalid email or password.",
      });
    }

    bcrypt.compare(user.password, foundUser.password, (matchErr, isMatch) => {
      if (matchErr) console.error("Error comparing hash: ", matchErr);
      if (isMatch) {
        const payload = {
          id: foundUser._id,
          email: foundUser.email,
        };

        jwt.sign(
          payload,
          JWTSecret,
          {expiresIn: 86400},
          (jwtError, token) => {
            if (jwtError) {
              console.error("Error signing web token: ", jwtError);
              return response.json({ 
                result: "failure",
                message: "Error signing token." 
              });
            }
            return response.json({
              result: "success",
              token: `Bearer ${token}`,
              data: {
                birth_date: foundUser.birth_date,
                email: foundUser.email,
                first_name: foundUser.first_name,
                left_hand: foundUser.left_hand,
                use_metric: foundUser.use_metric,
              }
            });
          }
        );
      } else {
        return response.json({
          result: "failure",
          message: "Invalid email or password.",
        });
      }
    });
  } catch (error) {
    if (error) console.error("Error finding user: ", error);
  }
});

export default authRoutes;