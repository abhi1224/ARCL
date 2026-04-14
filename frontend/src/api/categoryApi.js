import API from "./axios";

// GET
export const getCategories = () => API.get("/categories");

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