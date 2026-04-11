import { createEquipmentType, deleteEquipmentType, getEquipmentTypes, toggleEquipmentTypeStatus, updateEquipmentType } from "../api/equipmentTypeApi.js";

export const equipmentTypeService = {
  
  getAll: async () => {
    const res = await getEquipmentTypes();
    return res.data.data || res.data;
  },

  create: async (data) => {
    const res = await createEquipmentType(data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await updateEquipmentType(id, data);
    return res.data.data;
  },

  remove: async (id) => {
    await deleteEquipmentType(id);
    return id;
  },

  toggle: async (id) => {
    const res = await toggleEquipmentTypeStatus(id);
    return res.data.data;
  },
};