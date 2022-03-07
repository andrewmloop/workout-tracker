import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: [true, "An exercise name is required."],
  },
  description: {
    type: String,
  },
  token: {
    type: String,
  },
  muscle_group: {
    type: String,
    required: [true, "Please select a muscle group"],
    enum: ["chest", "shoulders", "back", "biceps", "triceps", "legs"],
    lowercase: true,
  },
}, {timestamps: true});

export default mongoose.model("Exercise", ExerciseSchema);