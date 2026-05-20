import { create } from "zustand";
import { categoryService } from "../services/categoryService.js";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // =========================
  // FETCH ALL CATEGORIES
  // =========================
  fetchCategories: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await categoryService.getAll();

      set({
        categories: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch (err) {
      set({
        error: err?.message || "Failed to fetch categories",
        loading: false,
      });
    }
  },

  // =========================
  // FETCH SINGLE CATEGORY BY SLUG
  // =========================
  fetchCategoryBySlug: async (slug) => {
    try {
      set({ loading: true, error: null });
      const response = await categoryService.getOne(slug);
      const category = response?.category || response;
      set({ selectedCategory: category, loading: false });
      return category;
    } catch (err) {
      set({
        error: err?.message || "Failed to fetch category",
        loading: false,
      });
      throw err;
    }
  },

  // =========================
  // CREATE CATEGORY
  // =========================
  addCategory: async (payload) => {
    try {
      set({ error: null });

      const response = await categoryService.create(payload);

      // support both response styles
      const newCategory = response?.category || response;

      set((state) => ({
        categories: [newCategory, ...state.categories],
      }));

      return newCategory;
    } catch (err) {
      set({
        error: err?.message || "Create category failed",
      });

      throw err;
    }
  },

  // =========================
  // UPDATE CATEGORY
  // =========================
  editCategory: async (id, payload) => {
    try {
      set({ error: null });

      const response = await categoryService.update(id, payload);

      const updatedCategory = response?.category || response;

      set((state) => ({
        categories: state.categories.map((item) =>
          item._id === id
            ? {
                ...item,
                ...updatedCategory,
              }
            : item,
        ),
      }));

      return updatedCategory;
    } catch (err) {
      set({
        error: err?.message || "Update category failed",
      });

      throw err;
    }
  },

  // =========================
  // DELETE CATEGORY
  // =========================
  removeCategory: async (id) => {
    try {
      set({ error: null });

      await categoryService.remove(id);

      set((state) => ({
        categories: state.categories.filter((item) => item._id !== id),
      }));
    } catch (err) {
      set({
        error: err?.message || "Delete category failed",
      });

      throw err;
    }
  },

  // =========================
  // TOGGLE ACTIVE
  // =========================
  toggleActive: async (id) => {
    try {
      set({ error: null });

      const response = await categoryService.toggleActive(id);

      const updatedCategory = response?.category || response;

      set((state) => ({
        categories: state.categories.map((item) =>
          item._id === id
            ? {
                ...item,
                ...updatedCategory,
              }
            : item,
        ),
      }));

      return updatedCategory;
    } catch (err) {
      set({
        error: err?.message || "Toggle active failed",
      });

      throw err;
    }
  },

  // =========================
  // TOGGLE FEATURED
  // =========================
  toggleFeatured: async (id) => {
    try {
      set({ error: null });

      const response = await categoryService.toggleFeatured(id);

      const updatedCategory = response?.category || response;

      set((state) => ({
        categories: state.categories.map((item) =>
          item._id === id
            ? {
                ...item,
                ...updatedCategory,
              }
            : item,
        ),
      }));

      return updatedCategory;
    } catch (err) {
      set({
        error: err?.message || "Toggle featured failed",
      });

      throw err;
    }
  },
}));
