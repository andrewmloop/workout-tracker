import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const LogSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  exercise: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  weight: {
    type: Number,
    default: 0,
    min: [0, "Please record your weight"],
  },
  reps: {
    type: Number,
    required: [true, "Please record your reps"],
    min: [0, "Invalid input"],
  },
  maxRep: {
    type: Number,
    default: 0,
  },
  form: {
    type: String,
    enum: ["good", "okay", "poor"],
    lowercase: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default Mongoose.model("Log", LogSchema);
