import Category from "../models/category.js";
import slugify from "slugify";

/* CREATE CATEGORY */
export const createCategory = async (req, res) => {
  try {
    const { name, description, filters } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = slugify(name, { lower: true });

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      filters,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};