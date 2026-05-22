import express from "express";

import {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactControllers.js";

const router = express.Router();

// CREATE CONTACT

router.post("/", createContact);

// GET ALL CONTACTS

router.get("/", getAllContacts);

// GET SINGLE CONTACT

router.get("/:id", getSingleContact);

// UPDATE STATUS

router.put("/:id", updateContactStatus);

// DELETE CONTACT

router.delete("/:id", deleteContact);

export default router;
