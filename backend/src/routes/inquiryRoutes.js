import express from "express";
import {
  createInquiry,
  deleteInquiry,
  getAllInquiries,
  getSingleInquiry,
  updateInquiryStatus,
} from "../controllers/inquiryControllers.js";

const router = express.Router();

// CREATE INQUIRY

router.post("/", createInquiry);

// GET ALL INQUIRIES

router.get("/", getAllInquiries);

// GET SINGLE INQUIRY

router.get("/:id", getSingleInquiry);

// UPDATE STATUS

router.put("/:id", updateInquiryStatus);

// DELETE INQUIRY

router.delete("/:id", deleteInquiry);

export default router;
