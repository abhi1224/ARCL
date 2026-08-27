import Inquiry from "../../models/inquiryModel.js";
import Product from "../../models/product.js";

/**
 * @desc    Submit Quotation Inquiry (Client)
 * @route   POST /api/v1/client/inquiries
 * @access  Public
 */
export const createInquiry = async (req, res) => {
  try {
    const {
      product: productId,
      productName,
      productSlug,
      category,
      customerName,
      email,
      phone,
      company,
      quantity,
      message,
    } = req.body;

    if (!productId || !customerName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Product, Name, Email, and Phone number are required.",
      });
    }

    const inquiry = await Inquiry.create({
      product: productId,
      productName: productName || "Product",
      productSlug: productSlug || "",
      category: category || "",
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company ? company.trim() : "",
      quantity: quantity ? parseInt(quantity) : 1,
      message: message ? message.trim() : "",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Quotation inquiry submitted successfully",
      inquiry,
    });
  } catch (error) {
    console.error("Create Inquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quotation inquiry",
      error: error.message,
    });
  }
};
