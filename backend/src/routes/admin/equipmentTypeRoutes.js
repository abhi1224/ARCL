import express from "express";
import {
  createEquipmentType,
  deleteEquipmentType,
  getAllEquipmentTypes,
  getSingleEquipmentType,
  toggleEquipmentTypeStatus,
  updateEquipmentType,
} from "../../controllers/admin/equipmentTypeControllers.js";

const router = express.Router();

router.post("/", createEquipmentType);
router.get("/", getAllEquipmentTypes);
router.get("/:id", getSingleEquipmentType);
router.put("/:id", updateEquipmentType);
router.patch("/:id/toggle", toggleEquipmentTypeStatus);
router.delete("/:id", deleteEquipmentType);

export default router;