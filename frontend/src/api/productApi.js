
import API from "./axios";

// =========================
// CREATE PRODUCT
// =========================

export const createProduct = (data) =>
  API.post("/products", data);

// =========================
// GET ALL PRODUCTS
// =========================

export const getProducts = (params = {}) =>
  API.get("/products", {
    params,
  });

// =========================
// GET SINGLE PRODUCT
// =========================

export const getProduct = (slug) =>
  API.get(`/products/${slug}`);

// =========================
// UPDATE PRODUCT
// =========================

export const updateProduct = (
  id,
  data
) =>
  API.put(`/products/${id}`, data);

// =========================
// DELETE PRODUCT
// =========================

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);
