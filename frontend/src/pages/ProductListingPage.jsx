import { useEffect, useState } from "react";
import ProductSidebar from "../components/products/ProductSidebar.jsx";
import ProductToolbar from "../components/products/ProductToolbar.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";

import { useProductStore } from "../store/useProductStore.js";
import { useCategoryStore } from "../store/useCategoryStore.js";
import { useEquipmentTypeStore } from "../store/useEquipmentTypeStore.js";
import { Filter, RotateCcw } from "lucide-react";

const ProductListingPage = () => {
  const { products, fetchProducts, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { equipmentTypes, fetchEquipmentTypes } = useEquipmentTypeStore();

  const [search, setSearch] = useState("");
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("");
  const [sort, setSort] = useState("latest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchEquipmentTypes();
  }, []);

  // Fetch products from backend whenever base filters change
  useEffect(() => {
    fetchProducts({
      search,
      equipmentType: selectedEquipmentType,
      sort,
    });
  }, [search, selectedEquipmentType, sort]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedEquipmentType("");
    setSort("latest");
  };

  const hasActiveFilters = Boolean(
    search || selectedEquipmentType || sort !== "latest"
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-white border-b border-gray-100 py-10 px-4 md:px-8 text-center">
        <div className="max-w-[1600px] mx-auto space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold text-[#021C57]">
            Laboratory Equipment Catalogue
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Browse our full spectrum of testing instruments, calibration tools, and precision scientific devices.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        
        {/* MOBILE FILTER TOGGLE & RESET */}
        <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 px-4 rounded-2xl text-sm font-semibold text-[#021C57] shadow-xs cursor-pointer"
          >
            <Filter size={16} />
            {mobileFilterOpen ? "Hide Categories" : "Filter by Category / Type"}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl text-xs font-semibold hover:bg-gray-200 transition cursor-pointer"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        {/* MOBILE FILTERS DRAWER */}
        {mobileFilterOpen && (
          <div className="lg:hidden mb-6 bg-white p-5 rounded-3xl border border-gray-200 shadow-md">
            <ProductSidebar
              categories={categories}
              equipmentTypes={equipmentTypes}
              selectedEquipmentType={selectedEquipmentType}
              setSelectedEquipmentType={(typeId) => {
                setSelectedEquipmentType(typeId);
                setMobileFilterOpen(false);
              }}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* DESKTOP SIDEBAR WITH CATEGORIES AND EQUIPMENT TYPES */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-36">
            <ProductSidebar
              categories={categories}
              equipmentTypes={equipmentTypes}
              selectedEquipmentType={selectedEquipmentType}
              setSelectedEquipmentType={setSelectedEquipmentType}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* MAIN PRODUCT LIST & TOOLBAR */}
          <div className="flex-1 w-full space-y-6">
            <ProductToolbar
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
              totalProducts={products.length}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <ProductGrid products={products} loading={loading} />
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProductListingPage;