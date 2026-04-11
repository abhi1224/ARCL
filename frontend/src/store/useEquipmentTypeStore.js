import { create } from "zustand";
import { equipmentTypeService } from "../services/equipmentTypeService.js";

export const useEquipmentTypeStore = create((set) => ({
  equipmentTypes: [],
  loading: false,
  error: null,

  fetchEquipmentTypes: async () => {
    try {
      set({ loading: true, error: null });

      const data = await equipmentTypeService.getAll(); 

      set({ equipmentTypes: data, loading: false });
    } catch (err) {
      set({ error: err.message || "Fetch failed", loading: false });
    }
  },

  addEquipmentType: async (payload) => {
    try {
      set({ error: null });

      const newItem = await equipmentTypeService.create(payload);

      set((state) => ({
        equipmentTypes: [newItem, ...state.equipmentTypes],
      }));

    } catch (err) {
      set({ error: err.message || "Create failed" });
      throw err; 
    }
  },

  editEquipmentType: async (id, payload) => {
    try {
      set({ error: null });

      const updated = await equipmentTypeService.update(id, payload);

      set((state) => ({
        equipmentTypes: state.equipmentTypes.map((item) =>
          item._id === id ? updated : item
        ),
      }));

    } catch (err) {
      set({ error: err.message || "Update failed" });
      throw err;
    }
  },

  removeEquipmentType: async (id) => {
    try {
      set({ error: null });

      await equipmentTypeService.remove(id);

      set((state) => ({
        equipmentTypes: state.equipmentTypes.filter(
          (item) => item._id !== id
        ),
      }));

    } catch (err) {
      set({ error: err.message || "Delete failed" });
    }
  },

  toggleStatus: async (id) => {
    try {
      const updated = await equipmentTypeService.toggle(id);

      set((state) => ({
        equipmentTypes: state.equipmentTypes.map((item) =>
          item._id === id ? updated : item
        ),
      }));

    } catch (err) {
      set({ error: "Toggle failed" });
    }
  },
}));