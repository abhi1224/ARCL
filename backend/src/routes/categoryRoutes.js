import express from 'express'
import { createCategory, getCategories, getCategory } from '../controllers/categoryControllers.js'

const router = express.Router()

router.post('/', createCategory)
router.get('/', getCategories);
router.get('/:slug', getCategory);

export default router;