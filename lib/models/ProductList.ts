import mongoose from "mongoose";

const productListSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number, // Percentage (e.g., 18 for 18%)
      default: 0,
    },
    npp: {
      type: Number, // Net Purchase Price (after gst maybe)
    },
    discount: {
      type: Number, // Percentage or flat
      default: 0,
    },
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    billNo: {
      type: String,
    },
    color: {
      type: String,
    },
    productOf: {
      type: String, // e.g., brand or supplier
    },
    purchaseDate: {
      type: Date,
    },
    tags: {
      type: [String],
      default: [],
    },
    count: {
      type: Number,
      default: 1,
    },
    feedbackTags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export const ProductList = mongoose.model("ProductList", productListSchema);
