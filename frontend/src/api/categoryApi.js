import API from "./axios";

export const getCategories = () => API.get("/categories");
export const deleteCategory = (id) => API.delete(`/categories/${id}`);