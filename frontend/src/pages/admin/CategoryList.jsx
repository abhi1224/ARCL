import { useEffect, useState } from "react";
import {
  getCategories,
  deleteCategory,
} from "../../api/categoryApi.js";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getCategories();
      setCategories(res.data); 
    } catch (err) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setDeletingId(id);
      await deleteCategory(id);

      // Optimistic UI update
      setCategories((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Delete failed. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Categories
        </h1>

        <Link
          to="/categories/create"
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FaPlus /> Add Category
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="animate-pulse text-gray-500">
            Loading categories...
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
      {!loading && !error && categories.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-gray-500 mb-3">
            No categories found.
          </p>
          <Link
            to="/categories/create"
            className="text-blue-500 hover:underline"
          >
            Create your first category →
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && !error && categories.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
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
                <tr
                  key={cat._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* Name */}
                  <td className="p-4 font-medium text-gray-800">
                    {cat.name}
                  </td>

                  {/* Equipment Type */}
                  <td className="p-4 text-gray-600">
                    {cat.equipmentType?.name || "—"}
                  </td>

                  {/* Filters */}
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full">
                      {cat.filters?.length || 0} filters
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        cat.isFeatured
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.isFeatured ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        cat.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 flex justify-center gap-4">

                    {/* Edit */}
                    <Link
                      to={`/categories/edit/${cat._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={18} />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(cat._id)}
                      disabled={deletingId === cat._id}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingId === cat._id ? "..." : <FaTrash size={18} />}
                    </button>

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