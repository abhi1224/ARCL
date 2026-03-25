import API from "./axios";

export const getEquipmentTypes = () => API.get("/equipment-types");
export const createEquipmentType = (data) => API.post("/equipment-types", data);
export const updateEquipmentType = (id, data) =>
  API.put(`/equipment-types/${id}`, data);
export const deleteEquipmentType = (id) =>
  API.delete(`/equipment-types/${id}`);