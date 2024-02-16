import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Your email is required"],
      lowercase: true,
      match: [/\S+@\S+.\S+/, "Invalid Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "A password is required"],
    },
    first_name: {
      type: String,
      required: [true, "Your first name is required"],
    },
    use_metric: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default Mongoose.model("User", UserSchema);