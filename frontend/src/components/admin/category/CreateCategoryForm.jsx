
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createCategory } from "../../../api/categoryApi.js";
import { getEquipmentTypes } from "../../../api/equipmentTypeApi.js";

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
      toast.error("Failed to load equipment types");
    }
  };

  // =========================
  // FILTERS
  // =========================

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
    if (form.filters.length === 1) return;

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

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

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

      await createCategory(payload);

      toast.success("Category created successfully !");

      navigate("/admin/categories");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Category
          </h2>

          <p className="text-gray-500 mt-1">
            Add new category and dynamic filters
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >

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
                className="w-full mt-2 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
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
                className="w-full mt-2 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
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
                  <option
                    key={item._id}
                    value={item._id}
                  >
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
              className="w-full mt-2 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
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
                <h3 className="text-xl font-semibold">
                  Filters
                </h3>

                <p className="text-sm text-gray-500">
                  Separate values using commas
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
                className="bg-gray-50 hover:bg-white border border-gray-200 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all"
              >

                <div className="grid md:grid-cols-2 gap-4">

                  {/* FILTER NAME */}
                  <div>
                    <label className="text-sm font-medium">
                      Filter Name
                    </label>

                    <input
                      type="text"
                      value={filter.name}
                      placeholder="e.g Capacity"
                      className="w-full mt-2 border border-gray-200 rounded-xl p-3"
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
                    <label className="text-sm font-medium">
                      Filter Values
                    </label>

                    <input
                      type="text"
                      value={filter.values}
                      placeholder="100L, 200L, 300L"
                      className="w-full mt-2 border border-gray-200 rounded-xl p-3"
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
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 disabled:opacity-40"
                  >
                    <FaTrash size={12} />
                    Remove
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
                <h3 className="font-semibold text-gray-800">Active Category</h3>

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
              onClick={() =>
                navigate("/admin/categories")
              }
              className="px-6 py-3 rounded-xl border cursor-pointer hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="min-w-[180px] bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg transition disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;

