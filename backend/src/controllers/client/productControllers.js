import Product from "../../models/product.js";
import Category from "../../models/category.js";
import EquipmentType from "../../models/equipmentType.js";

/**
 * Standard Client Category Population Config with nested EquipmentType
 */
const categoryPopulateConfig = {
  path: "category",
  select: "name slug description howItWorks howItWorksSteps features applications filters equipmentType",
  populate: {
    path: "equipmentType",
    select: "name slug",
  },
};

/**
 * Helper: Fallback to Category description, features, applications, and howItWorks if product's own are empty
 */
const resolveProductInheritance = (prodDoc) => {
  if (!prodDoc) return null;
  const prod = prodDoc.toObject ? prodDoc.toObject() : { ...prodDoc };

  if ((!prod.description || !prod.description.trim()) && prod.category?.description) {
    prod.description = prod.category.description;
  }

  if (
    (!prod.features || !Array.isArray(prod.features) || prod.features.length === 0) &&
    prod.category?.features?.length > 0
  ) {
    prod.features = prod.category.features;
  }

  if (
    (!prod.applications || !Array.isArray(prod.applications) || prod.applications.length === 0) &&
    prod.category?.applications?.length > 0
  ) {
    prod.applications = prod.category.applications;
  }

  // Inherit category's "How It Works" working principle and process steps to the product
  if (prod.category?.howItWorks) {
    prod.howItWorks = prod.category.howItWorks;
  }
  if (prod.category?.howItWorksSteps && prod.category.howItWorksSteps.length > 0) {
    prod.howItWorksSteps = prod.category.howItWorksSteps;
  }

  if (prod.category?.equipmentType?.name) {
    prod.equipmentTypeName = prod.category.equipmentType.name;
    prod.equipmentTypeId = prod.category.equipmentType._id;
  }

  return prod;
};

/**
 * @desc    Get All Active Products (Client)
 * @route   GET /api/v1/client/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      equipmentType,
      featured,
      sort = "latest",
      page,
      limit,
    } = req.query;

    const filter = { isActive: true };

    // Search by product name
    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // Filter by Featured
    if (typeof featured !== "undefined" && featured !== "") {
      filter.isFeatured = featured === "true" || featured === true;
    }

    // Filter by Category (slug or ObjectId)
    if (category && category.trim()) {
      let catId = category;
      if (!category.match(/^[0-9a-fA-F]{24}$/)) {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          catId = cat._id;
        } else {
          return res.status(200).json({ success: true, count: 0, data: [] });
        }
      }
      filter.category = catId;
    }

    // Filter by Equipment Type (slug or ObjectId)
    if (equipmentType && equipmentType.trim()) {
      let eqId = equipmentType;
      if (!equipmentType.match(/^[0-9a-fA-F]{24}$/)) {
        const eq = await EquipmentType.findOne({ slug: equipmentType });
        if (eq) {
          eqId = eq._id;
        }
      }

      if (eqId) {
        const categoriesInType = await Category.find({
          equipmentType: eqId,
          isActive: true,
        }).select("_id");

        const catIds = categoriesInType.map((c) => c._id);

        if (filter.category) {
          // If both category and equipmentType are filtered, ensure category is in equipmentType
          if (!catIds.some((id) => id.toString() === filter.category.toString())) {
            return res.status(200).json({ success: true, count: 0, data: [] });
          }
        } else {
          filter.category = { $in: catIds };
        }
      }
    }

    // Sort mappings
    let sortOption = { createdAt: -1 };
    if (sort === "a-z" || sort === "name-asc") {
      sortOption = { name: 1 };
    } else if (sort === "z-a" || sort === "name-desc") {
      sortOption = { name: -1 };
    } else if (sort === "popular" || sort === "featured") {
      sortOption = { isFeatured: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .populate(categoryPopulateConfig)
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      const resolvedProducts = products.map(resolveProductInheritance);

      return res.status(200).json({
        success: true,
        total,
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        data: resolvedProducts,
      });
    }

    const products = await Product.find(filter)
      .populate(categoryPopulateConfig)
      .sort(sortOption);

    const resolvedProducts = products.map(resolveProductInheritance);

    return res.status(200).json({
      success: true,
      count: resolvedProducts.length,
      data: resolvedProducts,
    });
  } catch (error) {
    console.error("Client Get Products Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

/**
 * @desc    Get Single Active Product by Slug (Client)
 * @route   GET /api/v1/client/products/:slug
 * @access  Public
 */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate(categoryPopulateConfig);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: resolveProductInheritance(product),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    });
  }
};

/**
 * @desc    Get Related Products (Client)
 * @route   GET /api/v1/client/products/:id/related
 * @access  Public
 */
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .populate(categoryPopulateConfig)
      .limit(4);

    const resolvedRelated = related.map(resolveProductInheritance);

    return res.status(200).json({
      success: true,
      data: resolvedRelated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch related products",
    });
  }
};

/**
 * @desc    Get Featured Products (Client)
 * @route   GET /api/v1/client/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .populate(categoryPopulateConfig)
      .limit(8);

    const resolvedProducts = products.map(resolveProductInheritance);

    return res.status(200).json({
      success: true,
      data: resolvedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch featured products",
    });
  }
};
