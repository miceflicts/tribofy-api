import Category from "../model/categoriesModel.js";
import { isValidObjectId } from "mongoose";

export const create = async (req, res) => {
  try {
    const { name, community, description, parentCategory, slug } = req.body;

    if (!name || !community) {
      return res
        .status(400)
        .json({ message: "Name and community are required" });
    }

    if (!isValidObjectId(community)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }

    if (parentCategory && !isValidObjectId(parentCategory)) {
      return res.status(400).json({ message: "Invalid parent category ID" });
    }

    const existingCategory = await Category.findOne({ name, community });
    if (existingCategory) {
      return res.status(409).json({
        message: "A category with this name already exists in this community",
      });
    }

    const newSlug = !slug ? name.toLowerCase().replace(/\s+/g, "-") : slug;
    const categoryData = new Category({
      name,
      community,
      description,
      parentCategory,
      slug: newSlug,
    });
    const savedCategory = await categoryData.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetch = async (req, res) => {
  try {
    const { community } = req.query;

    if (community && !isValidObjectId(community)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }

    const query = community ? { community } : {};
    const categories = await Category.find(query).populate(
      "parentCategory",
      "name"
    );

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { name, community } = req.body;

    // Verifica se já existe outra categoria com o novo nome na mesma comunidade
    const existingCategory = await Category.findOne({
      name,
      community,
      _id: { $ne: req.params.id }, // Exclui a categoria atual da busca
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "A category with this name already exists in this community",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Atualizar categorias filhas
    await Category.updateMany({ parentCategory: id }, { parentCategory: null });

    res
      .status(200)
      .json({ message: "Category deleted successfully", deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }

    const categories = await Category.find({ community: id }).lean();

    const buildTree = (parentId = null) => {
      return categories
        .filter((cat) => String(cat.parentCategory) === String(parentId))
        .map((cat) => ({
          ...cat,
          children: buildTree(cat._id),
        }));
    };

    const categoryTree = buildTree();

    res.status(200).json(categoryTree);
  } catch (error) {
    console.error("Error fetching category tree:", error);
    res
      .status(500)
      .json({ message: "Internal server error", details: error.message });
  }
};
