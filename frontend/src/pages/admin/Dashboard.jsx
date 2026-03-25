import { useEffect, useState } from "react";
import { FaBox, FaLayerGroup, FaThList, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import StatCard from "../../components/admin/common/StatCard.jsx";

import { getEquipmentTypes } from "../../api/equipmentTypeApi.js";
import { getCategories } from "../../api/categoryApi.js";
import { getProducts } from "../../api/productApi.js";

const Dashboard = () => {
  const [stats, setStats] = useState({
    equipmentTypes: 0,
    categories: 0,
    products: 0,
    featuredProducts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [eqRes, catRes, prodRes] = await Promise.all([
        getEquipmentTypes(),
        getCategories(),
        getProducts(),
      ]);

      const equipmentTypes = eqRes.data.data || eqRes.data; // handle both cases
      const categories = catRes.data;
      const products = prodRes.data;

      setStats({
        equipmentTypes: equipmentTypes.length,
        categories: categories.length,
        products: products.length,
        featuredProducts: products.filter((p) => p.isFeatured).length,
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      {/* Loading */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="animate-pulse text-gray-500">
            Loading dashboard...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard
              title="Equipment Types"
              value={stats.equipmentTypes}
              icon={<FaLayerGroup />}
              color="bg-blue-500"
            />

            <StatCard
              title="Categories"
              value={stats.categories}
              icon={<FaThList />}
              color="bg-green-500"
            />

            <StatCard
              title="Products"
              value={stats.products}
              icon={<FaBox />}
              color="bg-purple-500"
            />

            <StatCard
              title="Featured"
              value={stats.featuredProducts}
              icon={<FaStar />}
              color="bg-yellow-500"
            />

          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

            <div className="flex gap-4 flex-wrap">
              <Link
                to="/products/create"
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                + Add Product
              </Link>

              <Link
                to="/categories/create"
                className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
              >
                + Add Category
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;