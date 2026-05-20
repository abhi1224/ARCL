
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi.js";

export const productService = {
  // =========================
  // GET ALL PRODUCTS
  // =========================

  getAll: async (params = {}) => {
    try {
      const res = await getProducts(params);

      return res.data;

    } catch (err) {
      console.log(err);

      throw err;
    }
  },

  // =========================
  // GET SINGLE PRODUCT
  // =========================

  getOne: async (slug) => {
    try {
      const res = await getProduct(slug);

      return res.data;

    } catch (err) {
      console.log(err);

      throw err;
    }
  },

  // =========================
  // CREATE PRODUCT
  // =========================

  create: async (payload) => {
    try {
      const res = await createProduct(payload);

      return res.data;

    } catch (err) {
      console.log(err);

      throw err;
    }
  },

  // =========================
  // UPDATE PRODUCT
  // =========================

  update: async (id, payload) => {
    try {
      const res = await updateProduct(
        id,
        payload
      );

      return res.data;

    } catch (err) {
      console.log(err);

      throw err;
    }
  },

  // =========================
  // DELETE PRODUCT
  // =========================

  remove: async (id) => {
    try {
      const res = await deleteProduct(id);

      return res.data;

    } catch (err) {
      console.log(err);

      throw err;
    }
  },
};

