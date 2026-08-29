import { useEffect, useState, useMemo } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaBox,
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore.js";
import { useCategoryStore } from "../../store/useCategoryStore.js";
import Toggle from "../../components/admin/common/Toggle.jsx";
import SkeletonLoader from "../../components/admin/common/SkeletonLoader.jsx";
import Tooltip from "../../components/admin/common/Tooltip.jsx";
import ProductDetailsModal from "../../components/admin/product/ProductDetailsModal.jsx";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { formatTitleCase } from "../../utils/stringUtils.js";

const ProductList = () => {
  const {
    adminProducts,
    fetchAdminProducts,
    toggleActive,
    toggleFeatured,
    removeProduct,
    loading,
    error,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals & Action states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAdminProducts();
    fetchCategories();
  }, []);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, statusFilter, itemsPerPage]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return adminProducts.filter((product) => {
      const matchesSearch =
        !search.trim() ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.slug.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        product.category?._id === selectedCategory ||
        product.category === selectedCategory;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.isActive) ||
        (statusFilter === "inactive" && !product.isActive) ||
        (statusFilter === "featured" && product.isFeatured);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [adminProducts, search, selectedCategory, statusFilter]);

  // Paginated slice (configurable items per page)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // TOGGLE ACTIVE
  const handleToggleActive = async (id) => {
    try {
      setTogglingId(id);
      const res = await toggleActive(id);
      toast.success(
        `Product ${res.isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      toast.error("Failed to toggle product status");
    } finally {
      setTogglingId(null);
    }
  };

  // TOGGLE FEATURED
  const handleToggleFeatured = async (id) => {
    try {
      setTogglingId(id);
      const res = await toggleFeatured(id);
      toast.success(
        res.isFeatured ? "Marked as featured" : "Removed from featured"
      );
    } catch (err) {
      toast.error("Failed to toggle featured status");
    } finally {
      setTogglingId(null);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this product?"))
      return;

    try {
      setDeletingId(id);
      await removeProduct(id);
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // OPEN DETAILS MODAL
  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBox className="text-[#021C57]" /> Products Inventory
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Total {adminProducts.length} products • Showing {filteredProducts.length} filtered ({itemsPerPage} per page)
          </p>
        </div>

        <Link
          to="/admin/products/create"
          className="inline-flex items-center justify-center gap-2 bg-[#021C57] hover:bg-[#03308f] text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
        >
          <FaPlus size={13} /> Add New Product
        </Link>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or slug..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none bg-white text-gray-700 cursor-pointer focus:border-blue-500"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none bg-white text-gray-700 cursor-pointer focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="featured">Featured Only</option>
          </select>

          {/* Page Size Selector */}
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none bg-gray-50 text-gray-700 cursor-pointer focus:border-blue-500"
            title="Items per page"
          >
            <option value={10}>10 / page</option>
            <option value={15}>15 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {loading && <SkeletonLoader />}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="bg-white p-12 rounded-3xl shadow-xs border border-gray-100 text-center">
          <p className="text-gray-500 mb-4 text-base">
            No products matched your criteria.
          </p>
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 bg-[#021C57] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#03308f] transition"
          >
            <FaPlus /> Create New Product
          </Link>
        </div>
      )}

      {/* RESPONSIVE TABLE */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Specifications</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Active</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {paginatedProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/80 transition duration-150"
                  >
                    {/* PRODUCT INFO */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 shrink-0 overflow-hidden">
                          <img
                            src={
                              Array.isArray(product.images) && product.images[0]
                                ? product.images[0]
                                : typeof product.images === "string"
                                ? product.images
                                : "/placeholder.png"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="max-w-xs sm:max-w-sm">
                          <div className="font-semibold text-gray-800 line-clamp-1">
                            {formatTitleCase(product.name)}
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">
                            {product.description ? product.description.slice(0, 30) + (product.description.length > 30 ? "..." : "") : "No description"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="p-4 text-gray-600 font-medium">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {formatTitleCase(product.category?.name || "—")}
                      </span>
                    </td>

                    {/* SPECS */}
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-semibold rounded-full border border-blue-100">
                        {product.specifications
                          ? Object.keys(product.specifications).length
                          : 0}{" "}
                        specs
                      </span>
                    </td>

                    {/* IS FEATURED TOGGLE */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product._id)}
                        disabled={togglingId === product._id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer ${
                          product.isFeatured
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                        } disabled:opacity-50`}
                        title={
                          product.isFeatured
                            ? "Click to remove from featured"
                            : "Click to mark as featured on homepage"
                        }
                      >
                        {togglingId === product._id ? (
                          <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                        ) : product.isFeatured ? (
                          <FaStar className="text-amber-500" size={12} />
                        ) : (
                          <FaRegStar className="text-gray-400" size={12} />
                        )}
                        <span>{product.isFeatured ? "Featured" : "Standard"}</span>
                      </button>
                    </td>

                    {/* IS ACTIVE TOGGLE */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActive(product._id)}
                        disabled={togglingId === product._id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                            : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                        } disabled:opacity-50`}
                        title={
                          product.isActive
                            ? "Click to deactivate / hide from website"
                            : "Click to activate / publish on website"
                        }
                      >
                        {product.isActive ? (
                          <FaCheckCircle className="text-emerald-600" size={12} />
                        ) : (
                          <FaTimesCircle className="text-red-500" size={12} />
                        )}
                        <span>{product.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        
                        {/* EYE BUTTON (QUICK DETAILS POPUP) */}
                        <Tooltip text="View Full Details">
                          <button
                            onClick={() => handleOpenDetails(product)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                          >
                            <Eye className="w-5 h-5" />

                          </button>
                        </Tooltip>

                        {/* EDIT BUTTON */}
                        <Tooltip text="Edit Product">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                          >
                            <div className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition">
                              <FaEdit size={15} />
                            </div>
                          </Link>
                        </Tooltip>

                        {/* DELETE BUTTON */}
                        <Tooltip text="Delete Product">
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition disabled:opacity-50 cursor-pointer"
                          >
                            {deletingId === product._id ? (
                              <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </button>
                        </Tooltip>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
              <div>
                Showing{" "}
                <span className="font-bold text-gray-800">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-gray-800">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredProducts.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-800">
                  {filteredProducts.length}
                </span>{" "}
                products
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <FaChevronLeft size={10} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                      currentPage === pg
                        ? "bg-[#021C57] text-white shadow-xs"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* DETAILS MODAL POPUP */}
      <ProductDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={selectedProduct}
      />

    </div>
  );
};

export default ProductList;