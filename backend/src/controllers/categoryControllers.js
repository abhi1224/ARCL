import Category from "../models/category.js";
import slugify from "slugify";

/* CREATE CATEGORY */
export const createCategory = async (req, res) => {
  try {
    const { name, description, filters, equipmentType } = req.body;

    if (!name || !equipmentType) {
      return res.status(400).json({
        message: "Name and equipmentType are required"
      });
    }

    const slug = slugify(name, { lower: true });

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // validate filters
    const formattedFilters = filters?.map((f) => ({
      name: f.name,
      key: f.key || f.name.toLowerCase().replace(/\s+/g, "_"),
      values: f.values || []
    }));

    const category = await Category.create({
      name,
      slug,
      description,
      equipmentType,
      filters: formattedFilters
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate("equipmentType", "name slug")
      .sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE */
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true
    }).populate("equipmentType", "name slug");

    if (!category) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* UPDATE */
export const updateCategory = async (req, res) => {
  try {
    const { name, description, filters, equipmentType, isFeatured, isActive } =
      req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Not found" });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true });
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (equipmentType) {
      category.equipmentType = equipmentType;
    }

    if (typeof isFeatured !== "undefined") {
      category.isFeatured = isFeatured;
    }

    if (typeof isActive !== "undefined") {
      category.isActive = isActive;
    }

    if (filters) {
      category.filters = filters.map((f) => ({
        name: f.name,
        key: f.key || f.name.toLowerCase().replace(/\s+/g, "_"),
        values: f.values || []
      }));
    }

    const updated = await category.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE (SOFT) */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Not found" });
    }

    category.isActive = false;
    await category.save();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};