import mongoose from "mongoose";

const filterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    key: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // Master Key Features for all products in this category
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // Master Applications for all products in this category
    applications: [
      {
        type: String,
        trim: true,
      },
    ],

    equipmentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentType",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    filters: [filterSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);