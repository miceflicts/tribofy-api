import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "communities",
      required: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice composto para garantir unicidade de nome dentro de uma comunidade
categorySchema.index({ name: 1, community: 1 }, { unique: true });

const Category = mongoose.model("categories", categorySchema);

export default Category;
