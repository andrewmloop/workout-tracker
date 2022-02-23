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
  log_list: [{
    type: Schema.Types.ObjectId,
    ref: "Log",
  }],
}, {timestamps: true});


export default mongoose.model("Workout", WorkoutSchema);