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

const howItWorksStepSchema = new mongoose.Schema(
  {
    stepNumber: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
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

    // Optional Overview of "How It Works"
    howItWorks: {
      type: String,
      default: "",
    },

    // Dynamic Step-by-Step Working Principle Boxes (e.g. 3, 5, 10 steps)
    howItWorksSteps: [howItWorksStepSchema],

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