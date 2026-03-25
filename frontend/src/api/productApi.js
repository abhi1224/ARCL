import API from "./axios";

export const getProducts = () => API.get("/products");
export const deleteProduct = (id) => API.delete(`/products/${id}`);