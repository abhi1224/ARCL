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
    if (
      !confirm(
        "⚠️ Warning: Deletion May Affect Related Data\n\n" +
        "This record is linked to one or more products or dependent records. " +
        "Deleting it may impact associated data and system relationships.\n\n" +
        "Please verify all related products and dependencies before confirming this action. " +
        "This operation may not be reversible.\n\n" +
        "Do you want to proceed with deletion?"
      )
    ) return;


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