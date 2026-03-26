import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productControllers.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/",upload.single("upload"), createProduct);
router.get("/", getProducts);
router.get("/:slug", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;