import { useEffect, useState } from "react";
import ProductSidebar from "../components/products/ProductSidebar.jsx";
import ProductToolbar from "../components/products/ProductToolbar.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";

import { useProductStore } from "../store/useProductStore.js";
import { useCategoryStore } from "../store/useCategoryStore.js";
import { useEquipmentTypeStore } from "../store/useEquipmentTypeStore.js";

const ProductListingPage = () => {
  const {
    products,
    fetchProducts,
    loading,
    totalProducts,
  } = useProductStore();

  const { categories, fetchCategories } =
    useCategoryStore();

  const {
    equipmentTypes,
    fetchEquipmentTypes,
  } = useEquipmentTypeStore();

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedEquipmentType,
    setSelectedEquipmentType] = useState("");

  const [sort, setSort] = useState("latest");

  useEffect(() => {
    fetchCategories();
    fetchEquipmentTypes();
  }, []);

  useEffect(() => {
    fetchProducts({
      search,
      category: selectedCategory,
      equipmentType: selectedEquipmentType,
      sort,
    });
  }, [
    search,
    selectedCategory,
    selectedEquipmentType,
    sort,
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="bg-white border-b text-center">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">

          <h1 className="text-3xl md:text-5xl font-bold text-[#021C57]">
            Laboratory Equipment
          </h1>

          <p className="text-gray-500 mt-3 max-w-3xl mx-auto">
            Explore premium laboratory, analytical,
            industrial, and scientific instruments.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 flex gap-6">

        {/* SIDEBAR */}
        <ProductSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          equipmentTypes={equipmentTypes}
          selectedEquipmentType={selectedEquipmentType}
          setSelectedEquipmentType={setSelectedEquipmentType}
        />

        {/* PRODUCT GRID */}
        <ProductGrid
          products={products}
          loading={loading}
        />
      </section>
    </div>
  );
};

export default ProductListingPage;