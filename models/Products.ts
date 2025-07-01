import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true },
  category: { type: String, required: true, trim: true },
  stockQuantity: { type: Number, default: 0 },
  images: [{ type: String }],
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, trim: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Products", productSchema);