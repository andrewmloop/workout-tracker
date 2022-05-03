import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
    min: [0, "Please record your weight."],
  },
  reps: {
    type: Number,
    required: [true, "Please record your weight"],
    min: [1, "Please record your reps."],
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
  }
});

export default mongoose.model("Log", LogSchema);