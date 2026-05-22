import mongoose from "mongoose";

const inquirySchema =
new mongoose.Schema(
{
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  productName: {
    type: String,
    required: true,
  },

  productSlug: {
    type: String,
  },

  category: {
    type: String,
  },

  customerName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    trim: true,
  },

  quantity: {
    type: Number,
    default: 1,
  },

  message: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    enum: [
      "pending",
      "contacted",
      "completed",
    ],
    default: "pending",
  },

},
{
  timestamps: true,
}


);

export default mongoose.model(
"Inquiry",
inquirySchema
);
