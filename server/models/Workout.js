import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  routine: [{
    type: Schema.Types.ObjectId,
    ref: "Routine",
  }],
}, {timestamps: true});


export default mongoose.model("Workout", WorkoutSchema);