import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoutineSchema = new Schema({
  excercise_list: [{
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
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