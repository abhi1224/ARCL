import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCategory } from "../../../api/categoryApi.js";
import { getAdminEquipmentTypes } from "../../../api/equipmentTypeApi.js";

const CreateCategoryForm = () => {
  const navigate = useNavigate();

  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

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
    fetchEquipmentTypes();
  }, []);

  const fetchEquipmentTypes = async () => {
    try {
      const res = await getAdminEquipmentTypes();
      setEquipmentTypes(res.data?.data || res.data || []);
    } catch (err) {
      toast.error("Failed to load equipment types");
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
        isActive: true,
        filters: formattedFilters,
      };

      await createCategory(payload);
      toast.success("Category created successfully!");
      navigate("/admin/categories");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create Category
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Define a new equipment category and its dynamic filter attributes
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
                placeholder="e.g. Polarimeters & Refractometers"
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
              placeholder="Detailed description of instruments in this category..."
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
                  Add custom attributes for products in this category (e.g. Capacity, Accuracy, Material). Comma-separate allowable values.
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
                        placeholder="e.g. Measuring Range"
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
                        placeholder="e.g. ±45°, ±90°, 0-100%"
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
                  Display this category and its products in the featured showcase on the homepage
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
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;
