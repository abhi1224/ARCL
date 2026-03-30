import express from 'express';
import { createEquipmentType, deleteEquipmentType, getAllEquipmentTypes, getSingleEquipmentType, toggleEquipmentTypeStatus, updateEquipmentType } from '../controllers/equipmentTypeControllers.js';

const router = express.Router();

router.post('/', createEquipmentType)
router.get('/', getAllEquipmentTypes)
router.get('/:id', getSingleEquipmentType)
router.put('/:id', updateEquipmentType)
router.delete('/:id', deleteEquipmentType)
router.patch("/:id/toggle", toggleEquipmentTypeStatus);



export default router