import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCategory,
  updateCategory,
} from "../../../api/categoryApi.js";
import { getAdminEquipmentTypes } from "../../../api/equipmentTypeApi.js";

const EditCategoryForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(null);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    equipmentType: "",
    filters: [
      {
        name: "",
        values: "",
      },
    ],
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const fetchData = async () => {
    try {
      setPageLoading(true);

      const [eqRes, catRes] = await Promise.all([
        getAdminEquipmentTypes(),
        getCategory(slug),
      ]);

      setEquipmentTypes(eqRes.data?.data || eqRes.data || []);

      const data = catRes.data?.data || catRes.data;

      if (data) {
        setCategoryId(data._id);
        setForm({
          name: data.name || "",
          description: data.description || "",
          equipmentType: data.equipmentType?._id || data.equipmentType || "",
          filters:
            data.filters?.length > 0
              ? data.filters.map((f) => ({
                  name: f.name || "",
                  values: Array.isArray(f.values)
                    ? f.values.join(", ")
                    : f.values || "",
                }))
              : [{ name: "", values: "" }],
          isFeatured: data.isFeatured || false,
          isActive: typeof data.isActive === "boolean" ? data.isActive : true,
        });
      }
    } catch (err) {
      console.error("Failed to load category:", err);
      toast.error("Failed to load category details");
    } finally {
      setPageLoading(false);
    }
  };

  // FILTERS
  const addFilter = () => {
    setForm((prev) => ({
      ...prev,
      filters: [
        ...prev.filters,
        {
          name: "",
          values: "",
        },
      ],
    }));
  };

  const removeFilter = (index) => {
    if (form.filters.length === 1) {
      setForm((prev) => ({
        ...prev,
        filters: [{ name: "", values: "" }],
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }));
  };

  const handleFilterChange = (index, field, value) => {
    const updated = [...form.filters];
    updated[index][field] = value;
    setForm((prev) => ({
      ...prev,
      filters: updated,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.equipmentType) {
      toast.error("Category name and equipment type are required");
      return;
    }

    try {
      setLoading(true);

      const formattedFilters = form.filters
        .filter((f) => f.name.trim())
        .map((f) => ({
          name: f.name.trim(),
          key: f.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_"),
          values: f.values
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        }));

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        equipmentType: form.equipmentType,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        filters: formattedFilters,
      };

      await updateCategory(categoryId, payload);
      toast.success("Category updated successfully! 🎉");
      navigate("/admin/categories");
    } catch (err) {
      console.error("Update category error:", err);
      toast.error(
        err.response?.data?.message || "Failed to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading category information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Edit Category
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Update category properties and dynamic filter specifications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* BASIC INFO */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                className="w-full mt-2 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Equipment Type *
              </label>
              <select
                required
                value={form.equipmentType}
                className="w-full mt-2 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition bg-white cursor-pointer"
                onChange={(e) =>
                  setForm({ ...form, equipmentType: e.target.value })
                }
              >
                <option value="">Select Equipment Type</option>
                {equipmentTypes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              className="w-full mt-2 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* DYNAMIC FILTERS */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Dynamic Specification Filters
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Attributes used by products belonging to this category.
                </p>
              </div>

              <button
                type="button"
                onClick={addFilter}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
              >
                <FaPlus size={10} /> Add Filter
              </button>
            </div>

            <div className="space-y-4">
              {form.filters.map((filter, index) => (
                <div
                  key={index}
                  className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-4 hover:bg-white hover:shadow-xs transition"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">
                        Filter Name
                      </label>
                      <input
                        type="text"
                        value={filter.name}
                        className="w-full mt-1.5 border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none focus:border-blue-500"
                        onChange={(e) =>
                          handleFilterChange(index, "name", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">
                        Allowed Values (Comma-Separated)
                      </label>
                      <input
                        type="text"
                        value={filter.values}
                        className="w-full mt-1.5 border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none focus:border-blue-500"
                        onChange={(e) =>
                          handleFilterChange(index, "values", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeFilter(index)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                    >
                      <FaTrash size={11} /> Remove Attribute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURED TOGGLE */}
          <div className="pt-2">
            <label className="border border-gray-200 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-blue-400 transition bg-white">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
                className="w-5 h-5 accent-blue-600"
              />
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  Featured Category
                </h4>
                <p className="text-xs text-gray-400">
                  Highlight this category and its products in the featured section on the homepage
                </p>
              </div>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="px-6 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="min-w-[180px] bg-[#021C57] hover:bg-[#03308f] text-white px-8 py-3 rounded-xl font-medium shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditCategoryForm;
