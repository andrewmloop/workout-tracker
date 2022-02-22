import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoutineSchema = new Schema({
  excercise: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  target_sets: {type: Number},
  target_reps: {type: String},
}, {timestamps: true});


export default mongoose.model("Routine", RoutineSchema);