import express from 'express'

const router = express.Router()

router.post('/', createCategory)

export default router;