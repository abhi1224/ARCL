import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaStar, FaRegStar } from "react-icons/fa";
import EquipmentTypeModal from "../../components/admin/equipmentType/EquipmentTypeModal.jsx";
import EquipmentTypeEditModal from "../../components/admin/equipmentType/EquipmentTypeEditModal.jsx";
import Tooltip from "../../components/admin/common/Tooltip.jsx";
import SkeletonLoader from "../../components/admin/common/SkeletonLoader.jsx";
import useEquipmentType from "../../hooks/useEquipmentType.js";
import { formatTitleCase } from "../../utils/stringUtils.js";
import { toast } from "react-toastify";

const EquipmentTypeList = () => {
  const {
    equipmentTypes,
    fetchEquipmentTypes,
    loading,
    error,
    selectedItem,
    deletingId,
    togglingFeaturedId,
    handleEdit,
    handleToggleFeatured,
    handleDelete,
  } = useEquipmentType();

  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchEquipmentTypes();
  }, []);

  const onDeleteConfirm = async (id) => {
    try {
      await handleDelete(id);
    } catch (err) {
      // Handled inside hook
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Equipment Types</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Top-level industry equipment classifications ({equipmentTypes.length} total)
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#021C57] hover:bg-[#03308f] text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
        >
          <FaPlus size={14} /> Add Equipment Type
        </button>
      </div>

      {/* LOADING */}
      {loading && <SkeletonLoader />}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && equipmentTypes.length === 0 && (
        <div className="bg-white p-12 rounded-3xl shadow-xs border border-gray-100 text-center">
          <p className="text-gray-500 mb-4">No equipment types found.</p>
          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 bg-[#021C57] hover:bg-[#03308f] text-white px-5 py-2.5 rounded-xl font-medium transition cursor-pointer"
          >
            <FaPlus /> Create First Equipment Type
          </button>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && equipmentTypes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="p-4">Equipment Type Name</th>
                <th className="p-4 text-center">Featured on Home</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {equipmentTypes.map((item) => {
                const isFeatured = Boolean(item.isFeatured);
                const isToggling = togglingFeaturedId === item._id;

                return (
                  <tr key={item._id} className="hover:bg-gray-50/80 transition">
                    {/* NAME */}
                    <td className="p-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#021C57]"></span>
                        <span>{formatTitleCase(item.name)}</span>
                      </div>
                    </td>

                    {/* FEATURED TOGGLE BUTTON */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item._id)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer ${
                          isFeatured
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                        } disabled:opacity-50`}
                        title={
                          isFeatured
                            ? "Click to remove from homepage showcase"
                            : "Click to feature this equipment type on homepage"
                        }
                      >
                        {isToggling ? (
                          <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                        ) : isFeatured ? (
                          <FaStar className="text-amber-500" size={13} />
                        ) : (
                          <FaRegStar className="text-gray-400" size={13} />
                        )}
                        <span>{isFeatured ? "Featured" : "Standard"}</span>
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        <Tooltip text="Edit">
                          <button
                            onClick={() => handleEdit(item, setEditModalOpen)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          >
                            <FaEdit size={16} />
                          </button>
                        </Tooltip>

                        <Tooltip text="Delete">
                          <button
                            onClick={() => onDeleteConfirm(item._id)}
                            disabled={deletingId === item._id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 cursor-pointer"
                          >
                            {deletingId === item._id ? (
                              <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                            ) : (
                              <FaTrash size={16} />
                            )}
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
  );
};

export default EquipmentTypeList;