import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    gender: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "cr"], default: "student" },
    enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    deviceFingerprint: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
