import { useState, useEffect, useRef } from "react";
import { getCategories } from "../../api/categoryApi.js";
import { createProduct } from "../../api/productApi.js";
import { FaTimes, FaUpload } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const ProductForm = () => {
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    specifications: {},
    features: [""],
    applications: [""],
    isFeatured: false,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleCategoryChange = (id) => {
    const category = categories.find((c) => c._id === id);
    setSelectedCategory(category);

    const specs = {};
    category.filters.forEach((f) => {
      specs[f.key] = "";
    });

    setForm({ ...form, category: id, specifications: specs });
  };

  const handleSpecChange = (key, value) => {
    setForm({
      ...form,
      specifications: {
        ...form.specifications,
        [key]: value,
      },
    });
  };

  // FEATURES
  const addFeature = () =>
    setForm({ ...form, features: [...form.features, ""] });

  const removeFeature = (i) =>
    setForm({
      ...form,
      features: form.features.filter((_, index) => index !== i),
    });

  const handleFeatureChange = (i, value) => {
    const updated = [...form.features];
    updated[i] = value;
    setForm({ ...form, features: updated });
  };

  // APPLICATIONS
  const addApplication = () =>
    setForm({ ...form, applications: [...form.applications, ""] });

  const removeApplication = (i) =>
    setForm({
      ...form,
      applications: form.applications.filter((_, index) => index !== i),
    });

  const handleApplicationChange = (i, value) => {
    const updated = [...form.applications];
    updated[i] = value;
    setForm({ ...form, applications: updated });
  };

  // IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    fileInputRef.current.value = "";
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";

    if (form.features.some((f) => !f.trim()))
      newErrors.features = "All feature fields must be filled";

    if (form.applications.some((a) => !a.trim()))
      newErrors.applications = "All application fields must be filled";

    if (selectedCategory) {
      const emptySpec = Object.values(form.specifications).some(
        (v) => !v.trim()
      );
      if (emptySpec)
        newErrors.specifications = "All specifications must be selected";
    }

    if (!image) newErrors.image = "Product image is required";

    return newErrors;
  };

  // RESET FORM
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "",
      specifications: {},
      features: [""],
      applications: [""],
      isFeatured: false,
    });

    setImage(null);
    setPreview(null);
    setSelectedCategory(null);
    setErrors({});
    fileInputRef.current.value = "";
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setErrors({});

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (["features", "applications", "specifications"].includes(key)) {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      });

      if (image) formData.append("image", image);

      await createProduct(formData);

      setSuccess("Product created successfully 🎉");

      // RESET AFTER SUCCESS
      resetForm();

    } catch (err) {
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-8 space-y-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Create New Product
        </h2>

        {error && (
          <div className="flex justify-between items-center bg-red-100 text-red-600 px-4 py-3 rounded-lg">
            <span>{error}</span>
            <FaTimes className="cursor-pointer" onClick={() => setError("")} />
          </div>
        )}

        {success && (
          <div className="flex justify-between items-center bg-green-100 text-green-600 px-4 py-3 rounded-lg">
            <span>{success}</span>
            <FaTimes className="cursor-pointer" onClick={() => setSuccess("")} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <input
                value={form.name}
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={form.category}
                className="w-full border p-3 rounded-lg mt-1 cursor-pointer"
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              rows="3"
              className="w-full border p-3 rounded-lg mt-1"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {selectedCategory && (
            <div>
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedCategory.filters.map((f) => (
                  <div key={f.key}>
                    <label className="text-sm">{f.name}</label>
                    <select
                      value={form.specifications[f.key] || ""}
                      className="w-full border p-2 rounded mt-1 cursor-pointer"
                      onChange={(e) => handleSpecChange(f.key, e.target.value)}
                    >
                      <option value="">Select {f.name}</option>
                      {f.values.map((v, i) => (
                        <option key={i} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              {errors.specifications && <p className="text-red-500 text-sm mt-2">{errors.specifications}</p>}
            </div>
          )}

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            {form.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={f}
                  className="border p-2 w-full rounded"
                  onChange={(e) => handleFeatureChange(i, e.target.value)}
                />
                <button type="button" onClick={() => removeFeature(i)} className="text-red-500 cursor-pointer"><MdClose /></button>
              </div>
            ))}
            {errors.features && <p className="text-red-500 text-sm mt-2">{errors.features}</p>}
            <button type="button" onClick={addFeature} className="text-blue-500 text-sm cursor-pointer">+ Add Feature</button>
          </div>

          {/* Applications */}
          <div>
            <h3 className="font-semibold mb-2">Applications</h3>
            {form.applications.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={a}
                  className="border p-2 w-full rounded"
                  onChange={(e) => handleApplicationChange(i, e.target.value)}
                />
                <button type="button" onClick={() => removeApplication(i)} className="text-red-500 cursor-pointer"><MdClose /></button>
              </div>
            ))}
            {errors.applications && <p className="text-red-500 text-sm mt-2">{errors.applications}</p>}
            <button type="button" onClick={addApplication} className="text-blue-500 text-sm cursor-pointer">+ Add Application</button>
          </div>

          {/* Image */}
          <div>
            <label className="font-medium">Upload Image</label>

            <div
              onClick={() => fileInputRef.current.click()}
              className="mt-2 border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-400 transition"
            >
              <FaUpload className="mx-auto text-gray-400 text-xl mb-2" />
              <p className="text-sm text-gray-500">Click to upload image</p>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

            {preview && (
              <div className="relative mt-4 w-40">
                <img src={preview} alt="preview" className="rounded-lg shadow-md" />
                <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-black text-white p-1 rounded-full text-xs">✕</button>
              </div>
            )}

            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            />
            <label>Mark as Featured</label>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProductForm;