import { useEffect, useState } from "react";
import {
  getEquipmentTypes,
  deleteEquipmentType,
} from "../../api/equipmentTypeApi.js";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import EquipmentTypeModal from "../../components/admin/equipmentType/EquipmentTypeModal.jsx";
import Toggle from "../../components/admin/common/Toggle.jsx";
import { toggleEquipmentTypeStatus } from "../../api/equipmentTypeApi.js";
import Tooltip from "../../components/admin/common/Tooltip.jsx";

const EquipmentTypeList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getEquipmentTypes();
      setData(res.data.data);
    } catch (err) {
      setError("Failed to load equipment types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      setTogglingId(id);

      const res = await toggleEquipmentTypeStatus(id);

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? res.data.data : item
        )
      );
    } catch (err) {
      alert("Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      setDeletingId(id);
      await deleteEquipmentType(id);

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Delete failed. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">

      {/* Header */}
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

      {/* Loading */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 animate-pulse">
            Loading equipment types...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 mb-3">
            No equipment types found.
          </p>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create your first one →
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && data.length > 0 && (
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
              {data.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Name */}
                  <td className="p-4 font-medium text-gray-800">
                    {item.name}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <Toggle
                        checked={item.isActive}
                        onChange={() => handleToggle(item._id)}
                        disabled={togglingId === item._id}
                      />

                      <span
                        className={`text-sm font-medium ${
                          item.isActive ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>

                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 flex justify-center gap-4">

                    {/* Edit */}
                    <Tooltip text="Edit">
                      <Link
                        to={`/equipment-types/edit/${item._id}`}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <FaEdit size={18} />
                      </Link>
                    </Tooltip>


                    {/* Delete */}
                    <Tooltip text="Delete">
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        className="text-red-500 hover:text-red-700 transition cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === item._id ? "..." : <FaTrash size={18} />}
                      </button>
                    </Tooltip>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           <EquipmentTypeModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            onSuccess={fetchData}
          />
        </div>
      )}
    </div>
  );
};

export default EquipmentTypeList;