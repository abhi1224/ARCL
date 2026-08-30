import express from "express";
import {
  getProducts,
  getProduct,
} from "../../controllers/client/productControllers.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProduct);

export default router;