import express from 'express'
import { createCategory, deleteCategory, getCategories, getCategory, toggleCategoryActive, toggleCategoryFeatured, updateCategory } from '../controllers/categoryControllers.js'

const router = express.Router()

router.post('/', createCategory)
router.get('/', getCategories);
router.get('/:slug', getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.patch("/categories/:id/toggle-active", toggleCategoryActive);
router.patch("/categories/:id/toggle-featured", toggleCategoryFeatured);

export default router;