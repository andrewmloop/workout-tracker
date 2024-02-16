import Cors from "cors";
import Express from "express";

import Routes from "./routes";
import { verifyJWT } from "./middleware/jwt";

// Instantiate the app
const app = Express();

// Include middleware
app.use(Cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token");
  next();
});

// Serve the client
app.use(Express.static("build"));

// Routing
app.use("/api/exercise", verifyJWT, Routes.exerciseRoutes);
app.use("/api/log", verifyJWT, Routes.logRoutes);
app.use("/api/routine", verifyJWT, Routes.routineRoutes);
app.use("/api/user", verifyJWT, Routes.userRoutes);
app.use("/api/auth", Routes.authRoutes);

export default app;
