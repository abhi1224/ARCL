import Product from "../models/product.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const createProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      specifications,
      applications,
      features,
      category,
      isFeatured
    } = req.body;

    // Validation
    if (!name || !category) {
      return res.status(400).json({
        message: "Name and category are required"
      });
    }

    // Convert JSON strings → actual objects
    if (specifications) specifications = JSON.parse(specifications);
    if (applications) applications = JSON.parse(applications);
    if (features) features = JSON.parse(features);

    // Convert string → boolean
    isFeatured = isFeatured === "true";

    const slug = slugify(name, { lower: true });

    const exists = await Product.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        message: "Product already exists"
      });
    }

    let imageUrl = "";

    // Upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products"
      });

      imageUrl = result.secure_url;

      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    }

    const product = await Product.create({
      name,
      slug,
      description,
      specifications,
      applications,
      features,
      category,
      images: imageUrl ? [imageUrl] : [],
      isFeatured
    });

    res.status(201).json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      specifications,
      applications,
      features,
      category,
      images,
      isFeatured,
      isActive
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true });
    }

    if (description !== undefined) product.description = description;
    if (specifications) product.specifications = specifications;
    if (applications) product.applications = applications;
    if (features) product.features = features;
    if (category) product.category = category;
    if (images) product.images = images;

    if (typeof isFeatured !== "undefined") {
      product.isFeatured = isFeatured;
    }

    if (typeof isActive !== "undefined") {
      product.isActive = isActive;
    }

    const updated = await product.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};