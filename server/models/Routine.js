import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoutineSchema = new Schema({
  exercise_list: [{
    exercise: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    target_sets: Number,
    target_reps: Number,
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "A routine name is required."],
  },
}, {timestamps: true});


export default mongoose.model("Routine", RoutineSchema);