import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import { useEquipmentTypeStore } from "../../store/useEquipmentTypeStore";

import EquipmentTypeModal from "../../components/admin/equipmentType/EquipmentTypeModal.jsx";
import EquipmentTypeEditModal from "../../components/admin/equipmentType/EquipmentTypeEditModal.jsx";
import Toggle from "../../components/admin/common/Toggle.jsx";
import Tooltip from "../../components/admin/common/Tooltip.jsx";
import SkeletonLoader from "../../components/admin/common/SkeletonLoader.jsx";

const EquipmentTypeList = () => {
  const {
    equipmentTypes,
    fetchEquipmentTypes,
    removeEquipmentType,
    toggleStatus,
    loading,
    error,
  } = useEquipmentTypeStore();

  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchEquipmentTypes();
  }, []);

  // EDIT
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  // TOGGLE
  const handleToggle = async (id) => {
    try {
      setTogglingId(id);
      await toggleStatus(id);
    } finally {
      setTogglingId(null);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      setDeletingId(id);
      await removeEquipmentType(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Equipment Types
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition"
        >
          + Add Equipment Type
        </button>
      </div>

      {/* LOADING */}
      {loading && <SkeletonLoader />}

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && equipmentTypes.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 mb-3">
            No equipment types found.
          </p>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create your first one →
          </button>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && equipmentTypes.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {equipmentTypes.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">

                  {/* NAME */}
                  <td className="p-4 font-medium text-gray-800">
                    {item.name}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <Toggle
                        checked={item.isActive}
                        onChange={() => handleToggle(item._id)}
                        disabled={togglingId === item._id}
                      />

                      <span
                        className={`text-sm font-medium w-[70px] ${
                          item.isActive
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>

                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex justify-center gap-4">

                    <Tooltip text="Edit">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 cursor-pointer"
                      >
                        <FaEdit size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete">
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        className="text-red-500 cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === item._id ? "..." : <FaTrash size={18} />}
                      </button>
                    </Tooltip>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* MODALS */}
          <EquipmentTypeModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
          />

          <EquipmentTypeEditModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            selected={selectedItem}
          />

        </div>
      )}
    </div>
  );
};

export default EquipmentTypeList;