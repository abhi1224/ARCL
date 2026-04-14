import API from "./axios";

// GET ALL
export const getCategories = () => API.get("/categories");

// GET SINGLE
export const getCategory = (slug) => API.get(`/categories/${slug}`);

// CREATE
export const createCategory = (data) =>
  API.post("/categories", data);

// UPDATE
export const updateCategory = (id, data) =>
  API.put(`/categories/${id}`, data);

// DELETE (soft)
export const deleteCategory = (id) =>
  API.delete(`/categories/${id}`);

// TOGGLE ACTIVE
export const toggleCategoryActive = (id) =>
  API.patch(`/categories/${id}/toggle-active`);

// TOGGLE FEATURED
export const toggleCategoryFeatured = (id) =>
  API.patch(`/categories/${id}/toggle-featured`);