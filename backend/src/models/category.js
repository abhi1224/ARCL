import mongoose from "mongoose";

const filterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    key: {
      type: String,
      required: true
    },

    values: [String],
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

    equipmentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentType",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    filters: [filterSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);