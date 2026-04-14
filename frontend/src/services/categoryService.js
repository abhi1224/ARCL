import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
  toggleCategoryFeatured,
} from "../api/categoryApi";

export const categoryService = {
  
  // GET ALL
  getAll: async () => {
    const res = await getCategories();
    return res.data; // normalize
  },

  // GET SINGLE
  getOne: async (slug) => {
    const res = await getCategory(slug);
    return res.data;
  },

  // CREATE
  create: async (data) => {
    const res = await createCategory(data);
    return res.data;
  },

  // UPDATE
  update: async (id, data) => {
    const res = await updateCategory(id, data);
    return res.data;
  },

  // DELETE
  remove: async (id) => {
    await deleteCategory(id);
    return id;
  },

  // TOGGLE ACTIVE
  toggleActive: async (id) => {
    const res = await toggleCategoryActive(id);
    return res.data;
  },

  // TOGGLE FEATURED
  toggleFeatured: async (id) => {
    const res = await toggleCategoryFeatured(id);
    return res.data;
  },
};