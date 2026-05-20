
import { create } from "zustand";

import { productService } from "../services/productService.js";

export const useProductStore = create((set) => ({
  // =========================
  // STATES
  // =========================

  products: [],

  product: null,

  loading: false,

  error: null,

  totalProducts: 0,

  // =========================
  // FETCH PRODUCTS
  // =========================

  fetchProducts: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data =
        await productService.getAll(params);

      set({
        // Backend returns direct array
        products: data || [],

        totalProducts:
          data?.length || 0,

        loading: false,
      });

    } catch (err) {
      console.log(err);

      set({
        error:
          err.response?.data?.message ||
          "Failed to fetch products",

        loading: false,
      });
    }
  },

  // =========================
  // FETCH SINGLE PRODUCT
  // =========================

  fetchSingleProduct: async (slug) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data =
        await productService.getOne(slug);

      set({
        product: data,

        loading: false,
      });

      return data;

    } catch (err) {
      console.log(err);

      set({
        error:
          err.response?.data?.message ||
          "Failed to fetch product",

        loading: false,
      });

      throw err;
    }
  },

  // =========================
  // CREATE PRODUCT
  // =========================

  addProduct: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const newProduct =
        await productService.create(payload);

      set((state) => ({
        products: [
          newProduct,
          ...state.products,
        ],

        totalProducts:
          state.totalProducts + 1,

        loading: false,
      }));

      return newProduct;

    } catch (err) {
      console.log(err);

      set({
        error:
          err.response?.data?.message ||
          "Failed to create product",

        loading: false,
      });

      throw err;
    }
  },

  // =========================
  // UPDATE PRODUCT
  // =========================

  editProduct: async (
    id,
    payload
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const updatedProduct =
        await productService.update(
          id,
          payload
        );

      set((state) => ({
        products: state.products.map(
          (item) =>
            item._id === id
              ? updatedProduct
              : item
        ),

        product: updatedProduct,

        loading: false,
      }));

      return updatedProduct;

    } catch (err) {
      console.log(err);

      set({
        error:
          err.response?.data?.message ||
          "Failed to update product",

        loading: false,
      });

      throw err;
    }
  },

  // =========================
  // DELETE PRODUCT
  // =========================

  removeProduct: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await productService.remove(id);

      set((state) => ({
        products: state.products.filter(
          (item) => item._id !== id
        ),

        totalProducts:
          state.totalProducts - 1,

        loading: false,
      }));

    } catch (err) {
      console.log(err);

      set({
        error:
          err.response?.data?.message ||
          "Failed to delete product",

        loading: false,
      });

      throw err;
    }
  },

  // =========================
  // CLEAR PRODUCT
  // =========================

  clearProduct: () => {
    set({
      product: null,
    });
  },

  // =========================
  // CLEAR ERROR
  // =========================

  clearError: () => {
    set({
      error: null,
    });
  },
}));
