import Product from "../../models/product.js";
import Category from "../../models/category.js";
import slugify from "slugify";
import cloudinary from "../../config/cloudinary.js";

/**
 * Helper: Upload buffer to Cloudinary with safe Data URI fallback
 */
const uploadBufferToCloudinary = async (fileBuffer, mimetype) => {
  try {
    const secureUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(fileBuffer);
    });

    return secureUrl;
  } catch (cloudErr) {
    console.warn(
      "Cloudinary upload failed/credentials issue, using Data URI fallback:",
      cloudErr.message
    );
    const base64 = fileBuffer.toString("base64");
    return `data:${mimetype || "image/jpeg"};base64,${base64}`;
  }
};

/**
 * @desc    Create Product (Admin)
 * @route   POST /api/v1/admin/products
 * @access  Admin
 */
export const createProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      specifications,
      applications,
      features,
      category,
      isFeatured,
      isActive,
    } = req.body;

    // Field Validations
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product description is required.",
      });
    }

    // Convert JSON strings → actual objects/arrays if stringified
    if (typeof specifications === "string" && specifications.trim()) {
      try {
        specifications = JSON.parse(specifications);
      } catch (e) {
        specifications = {};
      }
    }

    if (typeof applications === "string" && applications.trim()) {
      try {
        applications = JSON.parse(applications);
      } catch (e) {
        applications = [];
      }
    }

    if (typeof features === "string" && features.trim()) {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = [];
      }
    }

    const cleanFeatures = Array.isArray(features)
      ? features.filter((f) => f && String(f).trim().length > 0)
      : [];

    const cleanApplications = Array.isArray(applications)
      ? applications.filter((a) => a && String(a).trim().length > 0)
      : [];

    if (cleanFeatures.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one key feature is required.",
      });
    }

    if (cleanApplications.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one application scope is required.",
      });
    }

    // Convert strings → boolean
    isFeatured = isFeatured === true || isFeatured === "true";
    isActive =
      typeof isActive !== "undefined"
        ? isActive === true || isActive === "true"
        : true;

    // Ensure category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: "Selected category not found in database.",
      });
    }

    // Slug generation
    let baseSlug =
      slugify(name, { lower: true, strict: true }) || `product-${Date.now()}`;
    let slug = baseSlug;

    // Auto-resolve unique slug
    const exists = await Product.findOne({ slug });
    if (exists) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    let imageUrl = "";

    // Upload image from memory buffer
    if (req.file && req.file.buffer) {
      imageUrl = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.mimetype
      );
    } else {
      imageUrl =
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600";
    }

    const product = await Product.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      specifications: specifications || {},
      applications: cleanApplications,
      features: cleanFeatures,
      category,
      images: imageUrl ? [imageUrl] : [],
      isFeatured,
      isActive,
    });

    await product.populate("category", "name slug");

    return res.status(201).json({
      success: true,
      message: "Product created successfully! 🎉",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * @desc    Get All Products (Admin - ALL active & inactive)
 * @route   GET /api/v1/admin/products
 * @access  Admin
 */
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      isFeatured,
      isActive,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (typeof isActive !== "undefined" && isActive !== "") {
      filter.isActive = isActive === "true" || isActive === true;
    }

    if (typeof isFeatured !== "undefined" && isFeatured !== "") {
      filter.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { slug: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sort] = order === "asc" ? 1 : -1;

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get Admin Products Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

/**
 * @desc    Get Single Product By ID (Admin)
 * @route   GET /api/v1/admin/products/id/:id
 * @access  Admin
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug filters"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    });
  }
};

/**
 * @desc    Get Single Product By Slug (Admin/Public)
 * @route   GET /api/v1/admin/products/:slug
 * @access  Admin
 */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    });
  }
};

/**
 * @desc    Update Product (Admin)
 * @route   PUT /api/v1/admin/products/:id
 * @access  Admin
 */
export const updateProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      specifications,
      applications,
      features,
      category,
      images,
      isFeatured,
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Convert JSON strings → actual objects
    if (typeof specifications === "string" && specifications.trim()) {
      try {
        specifications = JSON.parse(specifications);
      } catch (e) {}
    }
    if (typeof applications === "string" && applications.trim()) {
      try {
        applications = JSON.parse(applications);
      } catch (e) {}
    }
    if (typeof features === "string" && features.trim()) {
      try {
        features = JSON.parse(features);
      } catch (e) {}
    }
    if (typeof images === "string" && images.trim()) {
      try {
        images = JSON.parse(images);
      } catch (e) {}
    }

    if (typeof isFeatured !== "undefined") {
      isFeatured = isFeatured === true || isFeatured === "true";
    }
    if (typeof isActive !== "undefined") {
      isActive = isActive === true || isActive === "true";
    }

    // New Image uploaded via memory buffer
    if (req.file && req.file.buffer) {
      const uploadedUrl = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.mimetype
      );
      images = [uploadedUrl];
    }

    if (name && name.trim() && name !== product.name) {
      product.name = name.trim();
      const baseSlug = slugify(name, { lower: true, strict: true });
      const slugExists = await Product.findOne({
        slug: baseSlug,
        _id: { $ne: product._id },
      });
      product.slug = slugExists
        ? `${baseSlug}-${Date.now().toString().slice(-4)}`
        : baseSlug;
    }

    if (typeof description !== "undefined") product.description = description;
    if (typeof specifications !== "undefined")
      product.specifications = specifications;
    if (Array.isArray(applications))
      product.applications = applications.filter(Boolean);
    if (Array.isArray(features)) product.features = features.filter(Boolean);
    if (category) product.category = category;
    if (images && images.length > 0) product.images = images;
    if (typeof isFeatured !== "undefined") product.isFeatured = isFeatured;
    if (typeof isActive !== "undefined") product.isActive = isActive;

    await product.save();
    await product.populate("category", "name slug");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully! 🎉",
      data: product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

/**
 * @desc    Toggle Product Active Status (Admin)
 * @route   PATCH /api/v1/admin/products/:id/toggle-active
 * @access  Admin
 */
export const toggleProductActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${
        product.isActive ? "activated" : "deactivated"
      } successfully`,
      data: { id: product._id, isActive: product.isActive },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle status",
    });
  }
};

/**
 * @desc    Toggle Product Featured Status (Admin)
 * @route   PATCH /api/v1/admin/products/:id/toggle-featured
 * @access  Admin
 */
export const toggleProductFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product marked as ${
        product.isFeatured ? "featured" : "standard"
      }`,
      data: { id: product._id, isFeatured: product.isFeatured },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle featured status",
    });
  }
};

/**
 * @desc    Delete Product (Admin)
 * @route   DELETE /api/v1/admin/products/:id
 * @access  Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

/**
 * @desc    Get Products By Category Slug (Public/Admin)
 * @route   GET /api/v1/admin/products/category/:slug
 * @access  Public/Admin
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const products = await Product.find({
      category: category._id,
    }).populate("category", "name slug");

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products for category",
    });
  }
};
