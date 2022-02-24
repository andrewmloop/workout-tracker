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
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "This exercise needs a user."],
  },
  muscle_group: {
    type: String,
    required: [true, "Please select a muscle group"],
    enum: ["Chest", "Shoulders", "Back", "Biceps", "Triceps", "Legs"]
  },
  target_sets: {type: Number},
  target_reps: {type: String},
}, {timestamps: true});

export default mongoose.model("Exercise", ExerciseSchema);