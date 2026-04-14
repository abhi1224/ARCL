import { create } from "zustand";
import { categoryService } from "../services/categoryService.js";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // FETCH
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });

      const data = await categoryService.getAll();

      set({ categories: data, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch",
        loading: false,
      });
    }
  },

  // CREATE
  addCategory: async (payload) => {
    try {
      set({ error: null });

      const newItem = await categoryService.create(payload);

      set((state) => ({
        categories: [newItem, ...state.categories],
      }));

    } catch (err) {
      set({ error: err.message || "Create failed" });
      throw err;
    }
  },

  // UPDATE
  editCategory: async (id, payload) => {
    try {
      set({ error: null });

      const updated = await categoryService.update(id, payload);

      set((state) => ({
        categories: state.categories.map((item) =>
          item._id === id ? updated : item
        ),
      }));

    } catch (err) {
      set({ error: err.message || "Update failed" });
      throw err;
    }
  },

  // DELETE (SOFT)
  removeCategory: async (id) => {
    try {
      set({ error: null });

      await categoryService.remove(id);

      set((state) => ({
        categories: state.categories.filter(
          (item) => item._id !== id
        ),
      }));

    } catch (err) {
      set({ error: err.message || "Delete failed" });
    }
  },

  // TOGGLE ACTIVE
  toggleActive: async (id) => {
    try {
      const updated = await categoryService.toggleActive(id);

      set((state) => ({
        categories: state.categories.map((item) =>
          item._id === id ? updated : item
        ),
      }));

    } catch (err) {
      set({ error: "Toggle active failed" });
    }
  },

  // TOGGLE FEATURED
  toggleFeatured: async (id) => {
    try {
      const updated = await categoryService.toggleFeatured(id);

      set((state) => ({
        categories: state.categories.map((item) =>
          item._id === id ? updated : item
        ),
      }));

    } catch (err) {
      set({ error: "Toggle featured failed" });
    }
  },
}));