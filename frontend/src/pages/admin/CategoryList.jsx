import { useEffect, useState } from "react";
import { useCategoryStore } from "../../store/useCategoryStore.js";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Toggle from "../../components/admin/common/Toggle.jsx";
import SkeletonLoader from "../../components/admin/common/SkeletonLoader.jsx";
import Tooltip from "../../components/admin/common/Tooltip.jsx";

const CategoryList = () => {
  const {
    categories,
    fetchCategories,
    removeCategory,
    toggleActive,
    toggleFeatured,
    loading,
    error,
  } = useCategoryStore();

  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setDeletingId(id);
      await removeCategory(id);
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // TOGGLE ACTIVE
  const handleToggleActive = async (id) => {
    try {
      setTogglingId(id);
      await toggleActive(id);
    } finally {
      setTogglingId(null);
    }
  };

  // TOGGLE FEATURED
  const handleToggleFeatured = async (id) => {
    try {
      setTogglingId(id);
      await toggleFeatured(id);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Categories
        </h1>

        <Link
          to="/admin/categories/create"
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FaPlus /> Add Category
        </Link>
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
      {!loading && !error && categories.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          No categories found
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && categories.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-100 text-sm uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Equipment Type</th>
                <th className="p-4">Filters</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">

                  {/* NAME */}
                  <td className="p-4 font-medium">{cat.name}</td>

                  {/* EQUIPMENT TYPE */}
                  <td className="p-4">{cat.equipmentType?.name || "—"}</td>

                  {/* FILTER COUNT */}
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full">
                      {cat.filters?.length || 0} filters
                    </span>
                  </td>

                  {/* FEATURED */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={cat.isFeatured}
                        onChange={() => handleToggleFeatured(cat._id)}
                        disabled={togglingId === cat._id}
                      />
                      <span className="w-[80px] text-sm">
                        {cat.isFeatured ? "Featured" : "Normal"}
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={cat.isActive}
                        onChange={() => handleToggleActive(cat._id)}
                        disabled={togglingId === cat._id}
                      />
                      <span className="w-[80px] text-sm">
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex justify-center gap-4">

                    <Tooltip text="Edit">
                      <Link
                        className="text-blue-500 cursor-pointer"
                       to={`/admin/categories/edit/${cat._id}`}>
                        <FaEdit size={18} />
                      </Link>
                    </Tooltip>


                    <Tooltip text="Delete">
                        <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={deletingId === cat._id}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        {deletingId === cat._id ? "..." : <FaTrash />}
                      </button>
                    </Tooltip>
                    

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryList;