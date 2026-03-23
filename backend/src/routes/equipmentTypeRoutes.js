import express from 'express';
import { createEquipmentType, deleteEquipmentType, getAllEquipmentTypes, getSingleEquipmentType, updateEquipmentType } from '../controllers/equipmentTypeControllers.js';

const router = express.Router();

router.post('/', createEquipmentType)
router.get('/', getAllEquipmentTypes)
router.get('/:id', getSingleEquipmentType)
router.put('/:id', updateEquipmentType)
router.delete('/:id', deleteEquipmentType)



export default router