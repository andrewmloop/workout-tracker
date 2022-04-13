import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: [true, "An exercise name is required."],
  },
  force: {
    type: String,
    enum: ["push", "pull", "static", null]
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "expert"],
    lowercase: true,
  },
  mechanic: {
    type: String,
    enum: ["isolation", "compound", null],
    lowercase: true,
  },
  equipment: String,
  primaryMuscles: {
    type: [String],
    enum: ["shoulders", "chest", "quadriceps", "calves", "glutes", "hamstrings", "abdominals", "adductors", "biceps", "forearms", "abductors", "triceps", "lower back", "traps", "middle back", "lats", "neck"]
  },
  secondaryMuscles: {
    type: [String],
    enum: ["shoulders", "chest", "quadriceps", "calves", "glutes", "hamstrings", "abdominals", "adductors", "biceps", "forearms", "abductors", "triceps", "lower back", "traps", "middle back", "lats", "neck"]
  },
  category: {
    type: String,
    enum: ["strength", "stretching", "plyometrics", "strongman", "powerlifting", "cardio", "olympic weightlifting"],
    lowercase: true,
  },
  instructions: {
    type: [String],
  },
  user_created: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
}, {timestamps: true});

export default mongoose.model("Exercise", ExerciseSchema);