import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LogSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  routine: {
    type: Schema.Types.ObjectId,
    ref: "Routine",
    required: true,
  },
  reps: {
    type: Number,
    required: true,
    min: [1, "Please record your reps."],
  },
  form: {
    type: String,
    enum: ["Good", "Okay", "Poor"],
  }
});

export default mongoose.model("Log", LogSchema);