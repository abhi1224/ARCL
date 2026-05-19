import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";

import { createCategory, updateCategory } from "../../../api/categoryApi.js";
import { getEquipmentTypes } from "../../../api/equipmentTypeApi.js";

const CategoryForm = ({
  mode = "create",
  initialData = null,
  categoryId = null,
}) => {
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  const defaultFilter = {
    name: "",
    values: "",
  };

  const [form, setForm] = useState({
    name: "",
    description: "",
    equipmentType: "",
    filters: [defaultFilter],
    isFeatured: false,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // FETCH EQUIPMENT TYPES
  // =========================

  useEffect(() => {
    fetchEquipmentTypes();
  }, []);

  const fetchEquipmentTypes = async () => {
    try {
      const res = await getEquipmentTypes();
      setEquipmentTypes(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // PREFILL EDIT DATA
  // =========================

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        equipmentType:
          initialData.equipmentType?._id ||
          initialData.equipmentType ||
          "",

        filters:
          initialData.filters?.length > 0
            ? initialData.filters.map((f) => ({
                name: f.name,
                values: f.values.join(", "),
              }))
            : [defaultFilter],

        isFeatured: initialData.isFeatured || false,
        isActive:
          typeof initialData.isActive === "boolean"
            ? initialData.isActive
            : true,
      });
    }
  }, [initialData, mode]);

  // =========================
  // FILTERS
  // =========================

  const addFilter = () => {
    setForm((prev) => ({
      ...prev,
      filters: [...prev.filters, defaultFilter],
    }));
  };

  const removeFilter = (index) => {
    if (form.filters.length === 1) return;

    setForm((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }));
  };

  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...form.filters];

    updatedFilters[index][field] = value;

    setForm((prev) => ({
      ...prev,
      filters: updatedFilters,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formattedFilters = form.filters.map((f) => ({
        name: f.name,
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
        ...form,
        filters: formattedFilters,
      };

      if (mode === "create") {
        await createCategory(payload);

        setSuccess("Category created successfully 🎉");

        setForm({
          name: "",
          description: "",
          equipmentType: "",
          filters: [defaultFilter],
          isFeatured: false,
          isActive: true,
        });

      } else {
        await updateCategory(categoryId, payload);

        setSuccess("Category updated successfully 🎉");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${mode} category`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* HEADER */}
        <div className="border-b px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-3xl font-bold text-gray-800">
            {mode === "create"
              ? "Create Category"
              : "Edit Category"}
          </h2>

          <p className="text-gray-500 mt-1">
            Manage category details and filters
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* ALERTS */}
          {error && (
            <div className="flex justify-between items-center bg-red-100 text-red-600 px-4 py-3 rounded-xl">
              <span>{error}</span>

              <FaTimes
                className="cursor-pointer"
                onClick={() => setError("")}
              />
            </div>
          )}

          {success && (
            <div className="flex justify-between items-center bg-green-100 text-green-600 px-4 py-3 rounded-xl">
              <span>{success}</span>

              <FaTimes
                className="cursor-pointer"
                onClick={() => setSuccess("")}
              />
            </div>
          )}

          {/* BASIC INFO */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category Name
              </label>

              <input
                type="text"
                required
                value={form.name}
                placeholder="Enter category name"
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl mt-2 transition"
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* EQUIPMENT TYPE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Equipment Type
              </label>

              <select
                required
                value={form.equipmentType}
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl mt-2 cursor-pointer transition"
                onChange={(e) =>
                  setForm({
                    ...form,
                    equipmentType: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Equipment Type
                </option>

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
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows="4"
              value={form.description}
              placeholder="Write category description..."
              className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl mt-2 transition"
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* FILTERS */}
          <div className="space-y-5">

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Filters
                </h3>

                <p className="text-sm text-gray-500">
                  Add dynamic filters for this category
                </p>
              </div>

              <button
                type="button"
                onClick={addFilter}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
              >
                <FaPlus size={12} />
                Add Filter
              </button>
            </div>

            {form.filters.map((filter, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-5 bg-gray-50 space-y-4"
              >

                <div className="grid md:grid-cols-2 gap-4">

                  {/* FILTER NAME */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Filter Name
                    </label>

                    <input
                      type="text"
                      value={filter.name}
                      placeholder="e.g Capacity"
                      className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl mt-2 transition"
                      onChange={(e) =>
                        handleFilterChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* FILTER VALUES */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Filter Values
                    </label>

                    <input
                      type="text"
                      value={filter.values}
                      placeholder="100L, 200L, 300L"
                      className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl mt-2 transition"
                      onChange={(e) =>
                        handleFilterChange(
                          index,
                          "values",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* REMOVE */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeFilter(index)}
                    disabled={form.filters.length === 1}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm transition disabled:opacity-40"
                  >
                    <FaTrash size={12} />
                    Remove Filter
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TOGGLES */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* FEATURED */}
            <label className="border rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-blue-400 transition">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isFeatured: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />

              <div>
                <h3 className="font-semibold text-gray-800">
                  Featured Category
                </h3>

                <p className="text-sm text-gray-500">
                  Highlight category on homepage
                </p>
              </div>
            </label>

            {/* ACTIVE */}
            <label className="border rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-blue-400 transition">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />

              <div>
                <h3 className="font-semibold text-gray-800">
                  Active Category
                </h3>

                <p className="text-sm text-gray-500">
                  Enable category visibility
                </p>
              </div>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 border-t pt-6">

            <button
              type="button"
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="min-w-[180px] bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Category"
                : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
