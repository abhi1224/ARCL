import { useState, useEffect, useRef } from "react";
import { getAdminCategories } from "../../api/categoryApi.js";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../api/productApi.js";
import { useProductStore } from "../../store/useProductStore.js";
import { FaUpload, FaCheckCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { fetchAdminProducts } = useProductStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    specifications: {},
    features: [""],
    applications: [""],
    isFeatured: false,
    isActive: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      if (isEditMode) setPageLoading(true);

      // Fetch Categories
      const catRes = await getAdminCategories();
      const catList = catRes.data?.data || catRes.data || [];
      setCategories(catList);

      // If Edit Mode, fetch product details
      if (isEditMode && id) {
        const prodRes = await getProductById(id);
        const prod = prodRes.data?.data || prodRes.data;

        if (prod) {
          const matchedCategory = catList.find(
            (c) => c._id === (prod.category?._id || prod.category)
          );
          setSelectedCategory(matchedCategory || null);

          setForm({
            name: prod.name || "",
            description: prod.description || "",
            category: prod.category?._id || prod.category || "",
            specifications: prod.specifications || {},
            features:
              Array.isArray(prod.features) && prod.features.length > 0
                ? prod.features
                : [""],
            applications:
              Array.isArray(prod.applications) && prod.applications.length > 0
                ? prod.applications
                : [""],
            isFeatured: prod.isFeatured || false,
            isActive: typeof prod.isActive === "boolean" ? prod.isActive : true,
          });

          if (prod.images && prod.images.length > 0) {
            setPreview(prod.images[0]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load product form data:", err);
      toast.error("Failed to load product details");
    } finally {
      setPageLoading(false);
    }
  };

  const handleCategoryChange = (catId) => {
    const category = categories.find((c) => c._id === catId);
    setSelectedCategory(category || null);

    const specs = {};
    if (category?.filters) {
      category.filters.forEach((f) => {
        specs[f.key] = form.specifications[f.key] || "";
      });
    }

    setForm({ ...form, category: catId, specifications: specs });
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: null }));
    }
  };

  const handleSpecChange = (key, value) => {
    setForm({
      ...form,
      specifications: {
        ...form.specifications,
        [key]: value,
      },
    });
    if (errors[`spec_${key}`]) {
      setErrors((prev) => ({ ...prev, [`spec_${key}`]: null }));
    }
  };

  // FEATURES
  const addFeature = () =>
    setForm({ ...form, features: [...form.features, ""] });

  const removeFeature = (i) => {
    if (form.features.length === 1) {
      setForm({ ...form, features: [""] });
      return;
    }
    setForm({
      ...form,
      features: form.features.filter((_, index) => index !== i),
    });
  };

  const handleFeatureChange = (i, value) => {
    const updated = [...form.features];
    updated[i] = value;
    setForm({ ...form, features: updated });
    if (errors.features) {
      setErrors((prev) => ({ ...prev, features: null }));
    }
  };

  // APPLICATIONS
  const addApplication = () =>
    setForm({ ...form, applications: [...form.applications, ""] });

  const removeApplication = (i) => {
    if (form.applications.length === 1) {
      setForm({ ...form, applications: [""] });
      return;
    }
    setForm({
      ...form,
      applications: form.applications.filter((_, index) => index !== i),
    });
  };

  const handleApplicationChange = (i, value) => {
    const updated = [...form.applications];
    updated[i] = value;
    setForm({ ...form, applications: updated });
    if (errors.applications) {
      setErrors((prev) => ({ ...prev, applications: null }));
    }
  };

  // IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Product name is required.";
    if (!form.category) newErrors.category = "Please select a category.";
    if (!form.description.trim())
      newErrors.description = "Product description is required.";

    // Image required on create mode
    if (!isEditMode && !image && !preview) {
      newErrors.image = "Product image is required. Please upload an image file.";
    }

    // Dynamic category specifications validation
    if (selectedCategory && selectedCategory.filters?.length > 0) {
      selectedCategory.filters.forEach((filter) => {
        const val = form.specifications[filter.key];
        if (!val || !String(val).trim()) {
          newErrors[`spec_${filter.key}`] = `${filter.name} specification is required.`;
        }
      });
    }

    // Features validation (at least 1 non-empty)
    const validFeatures = form.features.filter((f) => f && f.trim());
    if (validFeatures.length === 0) {
      newErrors.features = "Please add at least one key feature point.";
    }

    // Applications validation (at least 1 non-empty)
    const validApplications = form.applications.filter((a) => a && a.trim());
    if (validApplications.length === 0) {
      newErrors.applications = "Please add at least one application scope.";
    }

    return newErrors;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("isFeatured", String(form.isFeatured));
      formData.append("isActive", String(form.isActive));

      formData.append(
        "specifications",
        JSON.stringify(form.specifications || {})
      );

      formData.append(
        "features",
        JSON.stringify(form.features.filter((f) => f && f.trim()))
      );

      formData.append(
        "applications",
        JSON.stringify(form.applications.filter((a) => a && a.trim()))
      );

      if (image) {
        formData.append("image", image);
      }

      if (isEditMode) {
        await updateProduct(id, formData);
        toast.success("Product updated successfully! 🎉");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully! 🎉");
      }

      await fetchAdminProducts().catch(() => {});

      setTimeout(() => {
        navigate("/admin/products");
      }, 500);
    } catch (err) {
      console.error("Product submission error:", err);
      toast.error(
        err.response?.data?.message ||
          (isEditMode ? "Failed to update product" : "Failed to create product")
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center">
        <div className="w-10 h-10 border-4 border-[#021C57] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading product information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 space-y-8">
        
        {/* FORM TITLE */}
        <div className="border-b border-gray-100 pb-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isEditMode
                ? "Update product specifications, images, and content."
                : "Add new laboratory equipment to the product catalogue. All fields with * are required."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* BASIC DETAILS */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                placeholder="e.g. Digital Automatic Polarimeter"
                className={`w-full border p-3.5 rounded-xl mt-1.5 focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.name
                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                className={`w-full border p-3.5 rounded-xl mt-1.5 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white cursor-pointer ${
                  errors.category
                    ? "border-red-400 bg-red-50/20 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-bold text-gray-700">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              rows="4"
              placeholder="Detailed description of features, compliance standards, and operating principles..."
              className={`w-full border p-3.5 rounded-xl mt-1.5 focus:ring-2 focus:ring-blue-100 outline-none transition ${
                errors.description
                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                if (errors.description)
                  setErrors({ ...errors, description: null });
              }}
            />
            {errors.description && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* DYNAMIC CATEGORY SPECIFICATIONS */}
          {selectedCategory && selectedCategory.filters?.length > 0 && (
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-base">
                  Technical Specifications ({selectedCategory.name}) <span className="text-red-500">*</span>
                </h3>
                <span className="text-xs text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-200 font-medium">
                  Dynamic Filters
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {selectedCategory.filters.map((f) => {
                  const specError = errors[`spec_${f.key}`];
                  return (
                    <div
                      key={f.key}
                      className={`bg-white p-4 rounded-xl border ${
                        specError ? "border-red-300 bg-red-50/10" : "border-gray-200/70"
                      }`}
                    >
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center justify-between">
                        <span>{f.name} <span className="text-red-500">*</span></span>
                        <span className="text-[10px] text-gray-400 font-mono">({f.key})</span>
                      </label>

                      {f.values?.length > 0 ? (
                        <select
                          value={form.specifications[f.key] || ""}
                          className={`w-full border p-2.5 rounded-lg mt-1.5 text-sm bg-white cursor-pointer outline-none ${
                            specError
                              ? "border-red-400 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                          onChange={(e) =>
                            handleSpecChange(f.key, e.target.value)
                          }
                        >
                          <option value="">Select {f.name}</option>
                          {f.values.map((v, i) => (
                            <option key={i} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={form.specifications[f.key] || ""}
                          placeholder={`Enter ${f.name} (e.g. 500 RPM, 100L)`}
                          className={`w-full border p-2.5 rounded-lg mt-1.5 text-sm outline-none ${
                            specError
                              ? "border-red-400 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                          onChange={(e) =>
                            handleSpecChange(f.key, e.target.value)
                          }
                        />
                      )}

                      {specError && (
                        <p className="text-red-500 text-[11px] font-semibold mt-1">
                          {specError}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* KEY FEATURES */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-700">
                Key Features <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="text-blue-600 hover:text-blue-800 text-xs font-bold cursor-pointer"
              >
                + Add Feature Point
              </button>
            </div>
            
            <div className="space-y-2.5">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={f}
                    placeholder={`Feature point #${i + 1} (e.g. High-accuracy digital LCD display)`}
                    className="border border-gray-200 p-3 w-full rounded-xl text-sm outline-none focus:border-blue-500"
                    onChange={(e) => handleFeatureChange(i, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              ))}
            </div>
            {errors.features && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {errors.features}
              </p>
            )}
          </div>

          {/* APPLICATIONS */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-700">
                Industrial & Lab Applications <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addApplication}
                className="text-blue-600 hover:text-blue-800 text-xs font-bold cursor-pointer"
              >
                + Add Application Scope
              </button>
            </div>

            <div className="space-y-2.5">
              {form.applications.map((a, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={a}
                    placeholder={`Application #${i + 1} (e.g. Soil & Concrete Quality Testing Labs)`}
                    className="border border-gray-200 p-3 w-full rounded-xl text-sm outline-none focus:border-blue-500"
                    onChange={(e) => handleApplicationChange(i, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeApplication(i)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              ))}
            </div>
            {errors.applications && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {errors.applications}
              </p>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-bold text-gray-700">
              Product Image {!isEditMode && <span className="text-red-500">*</span>}
            </label>

            <div
              onClick={() => fileInputRef.current.click()}
              className={`mt-2 border-2 border-dashed p-6 rounded-2xl text-center cursor-pointer transition ${
                errors.image
                  ? "border-red-400 bg-red-50/20"
                  : "border-gray-300 hover:border-blue-500 bg-gray-50/50 hover:bg-blue-50/30"
              }`}
            >
              <FaUpload className="mx-auto text-gray-400 text-xl mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                {image ? `Selected: ${image.name}` : "Click to select product image file"}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, JPEG up to 10MB</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {preview && (
              <div className="relative mt-4 w-48 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-md">
                <img
                  src={preview}
                  alt="Product preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/75 hover:bg-red-600 text-white p-1.5 rounded-full text-xs transition cursor-pointer"
                  title="Remove Image"
                >
                  <MdClose size={15} />
                </button>
                <div className="bg-blue-900/80 text-white text-[10px] text-center py-1 font-bold">
                  Image Ready
                </div>
              </div>
            )}

            {errors.image && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {errors.image}
              </p>
            )}
          </div>

          {/* TOGGLES */}
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <label className="border border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer hover:border-blue-400 transition bg-white">
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
                  Mark as Featured Product
                </h4>
                <p className="text-xs text-gray-400">
                  Highlight on the homepage catalogue showcase
                </p>
              </div>
            </label>

            <label className="border border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer hover:border-blue-400 transition bg-white">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="w-5 h-5 accent-blue-600"
              />
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  Product Active Status
                </h4>
                <p className="text-xs text-gray-400">
                  Show or hide this product on the public website
                </p>
              </div>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium text-gray-700 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="min-w-[180px] bg-[#021C57] hover:bg-[#03308f] text-white px-8 py-3 rounded-xl font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {isEditMode ? "Saving Changes..." : "Creating Product..."}
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductForm;
