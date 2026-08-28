import { useState, useEffect, useRef } from "react";
import { getAdminCategories } from "../../api/categoryApi.js";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../api/productApi.js";
import { useProductStore } from "../../store/useProductStore.js";
import { FaUpload, FaSlidersH, FaLayerGroup } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
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

  const [showAdvancedOverrides, setShowAdvancedOverrides] = useState(false);
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
            description:
              prod.description || matchedCategory?.description || "",
            category: prod.category?._id || prod.category || "",
            specifications: prod.specifications || {},
            features:
              Array.isArray(prod.features) && prod.features.length > 0
                ? prod.features
                : matchedCategory?.features?.length > 0
                ? matchedCategory.features
                : [""],
            applications:
              Array.isArray(prod.applications) && prod.applications.length > 0
                ? prod.applications
                : matchedCategory?.applications?.length > 0
                ? matchedCategory.applications
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
        specs[f.key] = form.specifications[f.key] || (f.values?.length ? f.values[0] : "");
      });
    }

    // Auto-inherit description, features, applications from the selected category!
    const inheritedDesc = category?.description || form.description || "";
    const inheritedFeatures =
      category?.features && category.features.length > 0
        ? category.features
        : form.features.length > 0 && form.features[0]
        ? form.features
        : [""];
    const inheritedApps =
      category?.applications && category.applications.length > 0
        ? category.applications
        : form.applications.length > 0 && form.applications[0]
        ? form.applications
        : [""];

    setForm({
      ...form,
      category: catId,
      specifications: specs,
      description: inheritedDesc,
      features: inheritedFeatures,
      applications: inheritedApps,
    });

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

    return newErrors;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in the required fields marked with *");
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append(
        "description",
        form.description.trim() || selectedCategory?.description || ""
      );
      formData.append("category", form.category);
      formData.append("isFeatured", String(form.isFeatured));
      formData.append("isActive", String(form.isActive));

      formData.append(
        "specifications",
        JSON.stringify(form.specifications || {})
      );

      const cleanFeatures = form.features.filter((f) => f && f.trim());
      formData.append(
        "features",
        JSON.stringify(
          cleanFeatures.length > 0
            ? cleanFeatures
            : selectedCategory?.features || []
        )
      );

      const cleanApplications = form.applications.filter((a) => a && a.trim());
      formData.append(
        "applications",
        JSON.stringify(
          cleanApplications.length > 0
            ? cleanApplications
            : selectedCategory?.applications || []
        )
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
        <div className="border-b border-gray-100 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {isEditMode ? "Edit Product" : "Create New Product"}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Select a category to auto-inherit its description, features, and applications. Just enter product name, image, and dynamic filter values!
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* STEP 1: CATEGORY SELECTION */}
          <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100 space-y-3">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <FaLayerGroup className="text-[#021C57]" /> Select Equipment Category <span className="text-red-500">*</span>
            </label>
            
            <select
              value={form.category}
              className={`w-full border p-3.5 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition bg-white cursor-pointer ${
                errors.category
                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">-- Choose Category --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.equipmentType?.name ? `(${c.equipmentType.name})` : ""}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {errors.category}
              </p>
            )}

            {selectedCategory && (
              <div className="text-xs text-blue-900 bg-white/80 p-3 rounded-xl border border-blue-200/80 flex items-center justify-between flex-wrap gap-2">
                <span>
                  ✓ Auto-inheriting default description, features, & applications from <strong>{selectedCategory.name}</strong>.
                </span>
                <span className="font-semibold text-blue-700">
                  {selectedCategory.filters?.length || 0} Dynamic Filters Defined
                </span>
              </div>
            )}
          </div>

          {/* STEP 2: PRODUCT NAME & DYNAMIC SPECIFICATION FILTERS */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* PRODUCT NAME */}
            <div>
              <label className="text-sm font-bold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                placeholder="Enter product name "
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

            {/* DYNAMIC SPECIFICATION FILTERS (e.g. Size / Capacity) */}
            {selectedCategory && selectedCategory.filters?.length > 0 ? (
              <div className="space-y-3">
                {selectedCategory.filters.map((f) => {
                  const specError = errors[`spec_${f.key}`];
                  return (
                    <div key={f.key}>
                      <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                        <span>
                          {f.name} (Filter) <span className="text-red-500">*</span>
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {f.key}
                        </span>
                      </label>

                      {f.values?.length > 0 ? (
                        <select
                          value={form.specifications[f.key] || ""}
                          className={`w-full border p-3.5 rounded-xl mt-1.5 text-sm bg-white cursor-pointer outline-none ${
                            specError
                              ? "border-red-400 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                          onChange={(e) =>
                            handleSpecChange(f.key, e.target.value)
                          }
                        >
                          <option value="">Select {f.name} value</option>
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
                          placeholder="Enter value for this specification"
                          className={`w-full border p-3.5 rounded-xl mt-1.5 text-sm outline-none ${
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
                        <p className="text-red-500 text-xs font-semibold mt-1">
                          {specError}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center text-xs text-gray-500">
                {selectedCategory
                  ? "This category has no variable dynamic filters configured."
                  : "Select a category to load its dynamic specification filters."}
              </div>
            )}

          </div>

          {/* STEP 3: IMAGE UPLOAD */}
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

          {/* STEP 4: OPTIONAL ADVANCED OVERRIDES ACCORDION */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/40">
            <button
              type="button"
              onClick={() => setShowAdvancedOverrides(!showAdvancedOverrides)}
              className="w-full p-4 flex items-center justify-between font-bold text-xs sm:text-sm text-gray-700 hover:bg-gray-100/70 transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-600" />
                Customize Description, Features & Applications (Optional Overrides)
              </span>
              <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                {showAdvancedOverrides ? "Hide Details" : "Show Details"}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    showAdvancedOverrides ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>

            {showAdvancedOverrides && (
              <div className="p-5 border-t border-gray-200 bg-white space-y-6 animate-fade-in">
                
                {/* DESCRIPTION */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Product Description (Auto-Inherited from Category)
                  </label>
                  <textarea
                    value={form.description}
                    rows="3"
                    placeholder="Auto-inherited from category..."
                    className="w-full border border-gray-200 p-3 rounded-xl mt-1.5 text-sm outline-none focus:border-blue-500"
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                {/* FEATURES */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Key Features
                    </label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-blue-600 hover:text-blue-800 text-xs font-bold cursor-pointer"
                    >
                      + Add Feature Point
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={f}
                          placeholder={`Feature #${i + 1}`}
                          className="border border-gray-200 p-2.5 w-full rounded-xl text-xs outline-none focus:border-blue-500"
                          onChange={(e) => handleFeatureChange(i, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <MdClose size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* APPLICATIONS */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Applications
                    </label>
                    <button
                      type="button"
                      onClick={addApplication}
                      className="text-blue-600 hover:text-blue-800 text-xs font-bold cursor-pointer"
                    >
                      + Add Application Scope
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.applications.map((a, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={a}
                          placeholder={`Application #${i + 1}`}
                          className="border border-gray-200 p-2.5 w-full rounded-xl text-xs outline-none focus:border-blue-500"
                          onChange={(e) => handleApplicationChange(i, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeApplication(i)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <MdClose size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
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
