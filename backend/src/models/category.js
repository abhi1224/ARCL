import mongoose from "mongoose";

const filterSchema = new mongoose.Schema(
  {
    name: {
      type: String, // e.g. Capacity
      required: true,
    },

    values: [String], // e.g. 100L, 200L, 300L
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    filters: [filterSchema], 
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);