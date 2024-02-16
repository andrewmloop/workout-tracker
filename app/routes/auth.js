import "dotenv/config";
import Bcrypt from "bcryptjs";
import Express from "express";
import JWT from "jsonwebtoken";

import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

const authRoutes = Express.Router();

// Register
authRoutes.route("/register").post(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.first_name;

  const takenEmail = await User.findOne({ email: email });

  if (takenEmail) {
    res.status(400).json({
      message: "Email already in use.",
    });
  } else {
    const hash = await Bcrypt.hash(password, 10);

    const newUser = {
      email: email,
      password: hash,
      first_name: firstName,
    };

    User.create(newUser, (userErr, result) => {
      if (userErr) {
        res.status(500).json({
          message: "Failed to create new user",
        });
      } else {
        res.status(200).json({
          message: "New user created",
          data: result,
        });
      }
    });
  }
});

// Login
authRoutes.route("/login").post(async (req, res) => {
  const user = req.body;

  try {
    const foundUser = await User.findOne({ email: user.email });

    if (!foundUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    Bcrypt.compare(user.password, foundUser.password, (matchErr, isMatch) => {
      if (matchErr) console.error("Error comparing hash: ", matchErr);
      if (isMatch) {
        const payload = {
          id: foundUser._id,
          email: foundUser.email,
        };

        JWT.sign(
          payload,
          JWT_SECRET,
          // Expires in 1 week
          { expiresIn: 604800 },
          (jwtError, token) => {
            if (jwtError) {
              console.error("Error signing web token: ", jwtError);
              return res.status(500).json({
                message: "Error signing token",
              });
            }
            return res.status(200).json({
              token: `Bearer ${token}`,
              data: {
                email: foundUser.email,
                first_name: foundUser.first_name,
                use_metric: foundUser.use_metric,
              },
            });
          }
        );
      } else {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
    });
  } catch (error) {
    if (error) console.error("Error finding user: ", error);
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
});

// Remember me
authRoutes.route("/remember-me").get((req, res) => {
  const token = req.headers["x-access-token"].split(" ")[1];

  if (token) {
    JWT.verify(token, JWT_SECRET, (err) => {
      if (err)
        return res.status(401).json({
          message: "Failed to authenticate",
          isLoggedIn: false,
        });
      res.status(200).json({
        message: "User authenticated",
        isLoggedIn: true,
      });
    });
  } else {
    res.status(401).json({
      message: "Incorrect token given",
      isLoggedIn: false,
    });
  }
});

export default authRoutes;
