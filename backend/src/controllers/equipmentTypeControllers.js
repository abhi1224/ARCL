import EquipmentType from "../models/EquipmentType.js";
import slugify from "slugify";

export const createEquipmentType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = slugify(name, { lower: true });

    const exists = await EquipmentType.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Already exists" });
    }

    const type = await EquipmentType.create({ name, slug });

    res.status(201).json({
      success: true,
      data: type
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEquipmentTypes = async (req, res) => {
  try {
    const types = await EquipmentType.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleEquipmentType = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await EquipmentType.findById(id);

    if (!type) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({
      success: true,
      data: type
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEquipmentType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }

    if (typeof isActive !== "undefined") {
      updateData.isActive = isActive;
    }

    const updated = await EquipmentType.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEquipmentType = async (req, res) => {
  try {
    const { id } = req.params;

    await EquipmentType.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};