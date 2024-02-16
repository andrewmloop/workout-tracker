import { Mongoose } from "mongoose";

import App from "./app/app";

// ENV variables
const PORT = process.env.PORT || 9900;
const MONGO_URI = process.env.MONGO_URI;

// Set up MongoDB connection
Mongoose.connect(MONGO_URI, {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

const db = Mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error."));

// Start the app
App.listen(PORT, () => {
  console.log("App is listening at port: " + PORT);
});
