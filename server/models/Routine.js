import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoutineSchema = new Schema({
  exercise_list: [{
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
    default: [],
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {timestamps: true});


export default mongoose.model("Routine", RoutineSchema);