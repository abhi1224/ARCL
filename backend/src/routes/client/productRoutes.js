import express from "express";
import {
  getProducts,
  getProduct,
  getProductsByCategory,
} from "../../controllers/client/productControllers.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/category/:slug", getProductsByCategory);
router.get("/:slug", getProduct);

export default router;