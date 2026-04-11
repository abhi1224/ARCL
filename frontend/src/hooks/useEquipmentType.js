// hooks/useEquipmentType.js

import { useState } from "react";
import { useEquipmentTypeStore } from "../store/useEquipmentTypeStore";

const useEquipmentType = () => {
  const {
    equipmentTypes,
    fetchEquipmentTypes,
    removeEquipmentType,
    toggleStatus,
    loading,
    error,
  } = useEquipmentTypeStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleEdit = (item, openEditModal) => {
    setSelectedItem(item);
    openEditModal(true);
  };

  const handleToggle = async (id) => {
    try {
      setTogglingId(id);
      await toggleStatus(id);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      setDeletingId(id);
      await removeEquipmentType(id);
    } finally {
      setDeletingId(null);
    }
  };

  return {
    equipmentTypes,
    fetchEquipmentTypes,
    loading,
    error,
    selectedItem,
    deletingId,
    togglingId,
    handleEdit,
    handleToggle,
    handleDelete,
  };
};

export default useEquipmentType;