import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const RoutineSchema = new Schema(
  {
    exercise_list: [
      {
        exercise: {
          type: Schema.Types.ObjectId,
          ref: "Exercise",
          required: true,
        },
        targSets: Number,
        targReps: Number,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "A routine name is required."],
    },
  },
  { timestamps: true }
);

export default Mongoose.model("Routine", RoutineSchema);
