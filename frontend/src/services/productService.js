import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from "../api/productApi.js";

export const productService = {
  // =========================
  // GET ALL PRODUCTS
  // =========================

  getAll: async (params = {}) => {
    const res = await getProducts(params);

    return res.data;
  },

  // =========================
  // GET SINGLE PRODUCT
  // =========================

  getOne: async (slug) => {
    const res = await getProduct(slug);

    return res.data;
  },

  // =========================
  // GET PRODUCTS BY CATEGORY
  // =========================

  getByCategory: async (slug, params = {}) => {
    const res = await getProductsByCategory(
      slug,

      params,
    );

    return res.data;
  },

  // =========================
  // CREATE PRODUCT
  // =========================

  create: async (payload) => {
    const res = await createProduct(payload);

    return res.data;
  },

  // =========================
  // UPDATE PRODUCT
  // =========================

  update: async (id, payload) => {
    const res = await updateProduct(
      id,

      payload,
    );

    return res.data;
  },

  // =========================
  // DELETE PRODUCT
  // =========================

  remove: async (id) => {
    const res = await deleteProduct(id);

    return res.data;
  },
};
