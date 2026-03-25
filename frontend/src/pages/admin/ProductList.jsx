import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
} from "../../api/productApi.js";
import { FaEdit, FaTrash, FaPlus, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getProducts();
      setProducts(res.data); // ✅ matches your backend
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(id);
      await deleteProduct(id);

      // Optimistic UI update
      setProducts((prev) => prev.filter((p) => p._id !== id));
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
          Products
        </h1>

        <Link
          to="/products/create"
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FaPlus /> Add Product
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 animate-pulse">
            Loading products...
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
      {!loading && !error && products.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-gray-500 mb-3">
            No products found.
          </p>
          <Link
            to="/products/create"
            className="text-blue-500 hover:underline"
          >
            Create your first product →
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && !error && products.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Specs</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* Product Name + Description */}
                  <td className="p-4">
                    <div className="font-medium text-gray-800">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {product.description || "No description"}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4 text-gray-600">
                    {product.category?.name || "—"}
                  </td>

                  {/* Specifications Count */}
                  <td className="p-4">
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 text-xs rounded-full">
                      {product.specifications
                        ? Object.keys(product.specifications).length
                        : 0}{" "}
                      specs
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="p-4">
                    {product.isFeatured ? (
                      <span className="flex items-center gap-1 text-yellow-500 text-sm">
                        <FaStar /> Featured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        —
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 flex justify-center gap-4">

                    {/* Edit */}
                    <Link
                      to={`/products/edit/${product._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={18} />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingId === product._id ? "..." : <FaTrash size={18} />}
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

export default ProductList;