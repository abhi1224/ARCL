import API from "./axios";

export const createProduct = (data) => API.post("/products", data);
export const getProducts = () => API.get("/products");
export const deleteProduct = (id) => API.delete(`/products/${id}`);