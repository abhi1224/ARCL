import slugify from "slugify";
import EquipmentType from "../../models/equipmentType.js";
import Category from "../../models/category.js";
import Product from "../../models/product.js";
import mongoose from "mongoose";

/**
 * @desc    Create Equipment Type
 * @route   POST /api/v1/admin/equipment-types
 * @access  Admin
 */
export const createEquipmentType = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Equipment type name is required.",
      });
    }

    // Generate slug
    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Check duplicate name
    const existingEquipment = await EquipmentType.findOne({
      $or: [
        { name: name.trim() },
        { slug }
      ],
    });

    if (existingEquipment) {
      return res.status(409).json({
        success: false,
        message: "Equipment type already exists.",
      });
    }

    // Create equipment type
    const equipmentType = await EquipmentType.create({
      name: name.trim(),
      slug,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Equipment type created successfully.",
      data: equipmentType,
    });
  } catch (error) {
    console.error("Create Equipment Type Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @desc    Get All Equipment Types
 * @route   GET /api/v1/admin/equipment-types
 * @access  Admin
 */
export const getAllEquipmentTypes = async (req, res) => {
  try {
    const equipmentTypes = await EquipmentType.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: equipmentTypes.length,
      data: equipmentTypes,
    });
  } catch (error) {
    console.error("Get Equipment Types Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @desc    Get Single Equipment Type
 * @route   GET /api/v1/admin/equipment-types/:id
 * @access  Admin
 */
export const getSingleEquipmentType = async (req, res) => {
  try {
    const { id } = req.params;

    const equipmentType = await EquipmentType.findById(id);

    if (!equipmentType) {
      return res.status(404).json({
        success: false,
        message: "Equipment type not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: equipmentType
    });
  } catch (error) {
    console.error("Get Equipment Type Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * @desc    Update Equipment Type
 * @route   PUT /api/v1/admin/equipment-types/:id
 * @access  Admin
 */
export const updateEquipmentType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Equipment type name is required."
      });
    }

    const equipmentType = await EquipmentType.findById(id);

    if (!equipmentType) {
      return res.status(404).json({
        success: false,
        message: "Equipment type not found."
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true
    });

    const duplicateEquipment = await EquipmentType.findOne({
      slug,
      _id: { $ne: id }
    });

    if (duplicateEquipment) {
      return res.status(409).json({
        success: false,
        message: "Equipment type already exists."
      });
    }

    equipmentType.name = name.trim();
    equipmentType.slug = slug;

    await equipmentType.save();

    return res.status(200).json({
      success: true,
      message: "Equipment type updated successfully.",
      data: equipmentType
    });
  } catch (error) {
    console.error("Update Equipment Type Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * @desc    Toggle Equipment Type Status
 * @route   PATCH /api/v1/admin/equipment-types/:id/toggle
 * @access  Admin
 */
export const toggleEquipmentTypeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const equipmentType = await EquipmentType.findById(id);

    if (!equipmentType) {
      return res.status(404).json({
        success: false,
        message: "Equipment type not found.",
      });
    }

    equipmentType.isActive = !equipmentType.isActive;
    await equipmentType.save();

    return res.status(200).json({
      success: true,
      message: `Equipment type ${equipmentType.isActive ? "activated" : "deactivated"} successfully.`,
      data: equipmentType,
    });
  } catch (error) {
    console.error("Toggle Equipment Type Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete Equipment Type
 * @route   DELETE /api/v1/admin/equipment-types/:id
 * @access  Admin
 */
export const deleteEquipmentType = async (req, res) => {
  try {
    const { id } = req.params;

    const equipmentType = await EquipmentType.findById(id);

    if (!equipmentType) {
      return res.status(404).json({
        success: false,
        message: "Equipment Type not found.",
      });
    }

    // Check if any categories are associated with this Equipment Type
    const categoryCount = await Category.countDocuments({
      equipmentType: id,
    });

    if (categoryCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete Equipment Type because it contains categories. Please delete the associated categories first.",
      });
    }

    await EquipmentType.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Equipment Type deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Equipment Type Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};