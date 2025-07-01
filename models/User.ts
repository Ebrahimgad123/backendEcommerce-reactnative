import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String},
  email: { type: String },
  password: { type: String},
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  addresses: [
    {
      name: String,
      mobileNo: String,
      houseNo: String,
      street: String,
      landMark: String,
      city: String,
      country: String,
      postalCode: String,
    },
  ],
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
