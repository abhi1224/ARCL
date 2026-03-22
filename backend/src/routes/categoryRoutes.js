import express from 'express'
import { createCategory, getCategories, getCategory, updateCategory } from '../controllers/categoryControllers.js'

const router = express.Router()

router.post('/', createCategory)
router.get('/', getCategories);
router.get('/:slug', getCategory);
router.put("/:id", updateCategory);

export default router;