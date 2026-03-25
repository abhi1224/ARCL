import { useEffect, useState } from "react";
import { FaBox, FaLayerGroup, FaThList, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import StatCard from "../../components/admin/common/StatCard.jsx";

// import { getEquipmentTypes } from "../../api/equipmentType.api";
// Later you will import category + product APIs

const Dashboard = () => {
  const [stats, setStats] = useState({
    equipmentTypes: 0,
    categories: 0,
    products: 0,
    featuredProducts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
    //   const eqRes = await getEquipmentTypes();

      setStats({
        equipmentTypes: 12,       // temp (replace later)
        categories: 8,        // temp (replace later)
        products: 24,         // temp
        featuredProducts: 5,  // temp
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 ">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
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

    </div>
  );
};

export default Dashboard;