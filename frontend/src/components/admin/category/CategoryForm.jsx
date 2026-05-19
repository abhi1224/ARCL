import { useEffect, useState } from "react";

const CategoryForm = ({
  mode = "create",
  initialData = null,
  equipmentTypes = [],
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    equipmentType: "",
    filters: [],
    isFeatured: false,
    isActive: true,
  });

  // =========================
  // PREFILL FOR EDIT
  // =========================
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        equipmentType:
          initialData.equipmentType?._id ||
          initialData.equipmentType ||
          "",
        filters: initialData.filters || [],
        isFeatured: initialData.isFeatured || false,
        isActive:
          typeof initialData.isActive === "boolean"
            ? initialData.isActive
            : true,
      });
    }
  }, [mode, initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================
  // ADD FILTER
  // =========================
  const addFilter = () => {
    setFormData((prev) => ({
      ...prev,
      filters: [
        ...prev.filters,
        {
          name: "",
          key: "",
          values: [],
        },
      ],
    }));
  };

  // =========================
  // REMOVE FILTER
  // =========================
  const removeFilter = (index) => {
    setFormData((prev) => ({
      ...prev,
      filters: prev.filters.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =========================
  // UPDATE FILTER
  // =========================
  const updateFilter = (index, field, value) => {
    const updatedFilters = [...formData.filters];

    if (field === "values") {
      updatedFilters[index][field] = value
        .split(",")
        .map((v) => v.trim());
    } else {
      updatedFilters[index][field] = value;
    }

    setFormData((prev) => ({
      ...prev,
      filters: updatedFilters,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return alert("Category name is required");
    }

    if (!formData.equipmentType) {
      return alert("Equipment type is required");
    }

    await onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto">

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
      >

        {/* HEADER */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {mode === "create"
              ? "Create Category"
              : "Edit Category"}
          </h1>

          <p className="text-gray-500 mt-1">
            Manage category details and filters
          </p>
        </div>

        {/* NAME */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">
            Category Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* EQUIPMENT TYPE */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">
            Equipment Type
          </label>

          <select
            name="equipmentType"
            value={formData.equipmentType}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              Select Equipment Type
            </option>

            {equipmentTypes.map((type) => (
              <option
                key={type._id}
                value={type._id}
              >
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write category description..."
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* FILTERS */}
        <div className="space-y-5">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Filters
            </h2>

            <button
              type="button"
              onClick={addFilter}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Filter
            </button>
          </div>

          {formData.filters.length === 0 && (
            <div className="border rounded-xl p-6 text-gray-400 text-center">
              No filters added
            </div>
          )}

          {formData.filters.map((filter, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 space-y-4"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* FILTER NAME */}
                <div>
                  <label className="text-sm text-gray-600">
                    Filter Name
                  </label>

                  <input
                    type="text"
                    value={filter.name}
                    onChange={(e) =>
                      updateFilter(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Capacity"
                    className="w-full border rounded-lg px-4 py-2 mt-1"
                  />
                </div>

                {/* FILTER KEY */}
                <div>
                  <label className="text-sm text-gray-600">
                    Filter Key
                  </label>

                  <input
                    type="text"
                    value={filter.key}
                    onChange={(e) =>
                      updateFilter(
                        index,
                        "key",
                        e.target.value
                      )
                    }
                    placeholder="capacity"
                    className="w-full border rounded-lg px-4 py-2 mt-1"
                  />
                </div>
              </div>

              {/* FILTER VALUES */}
              <div>
                <label className="text-sm text-gray-600">
                  Values (comma separated)
                </label>

                <input
                  type="text"
                  value={filter.values.join(", ")}
                  onChange={(e) =>
                    updateFilter(
                      index,
                      "values",
                      e.target.value
                    )
                  }
                  placeholder="100L, 200L, 300L"
                  className="w-full border rounded-lg px-4 py-2 mt-1"
                />
              </div>

              {/* REMOVE FILTER */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    removeFilter(index)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Filter
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* TOGGLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* FEATURED */}
          <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-5 h-5"
            />

            <div>
              <h3 className="font-medium">
                Featured Category
              </h3>

              <p className="text-sm text-gray-500">
                Show category in featured sections
              </p>
            </div>
          </label>

          {/* ACTIVE */}
          <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5"
            />

            <div>
              <h3 className="font-medium">
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
            className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create Category"
              : "Update Category"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CategoryForm;
