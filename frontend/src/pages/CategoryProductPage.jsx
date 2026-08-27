import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore.js";
import ProductCard from "../components/products/ProductCard.jsx";
import ProductToolbar from "../components/products/ProductToolbar.jsx";
import { Filter, X, RotateCcw, ChevronRight, Layers } from "lucide-react";

const CategoryProductPage = () => {
  const { slug } = useParams();
  const { categoryProducts, categoryData, fetchProductsByCategory, loading } =
    useProductStore();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProductsByCategory(slug);
      setSelectedFilters({});
      setSearch("");
      setSort("latest");
    }
  }, [slug]);

  // Handle filter checkbox toggle
  const handleFilterToggle = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      if (updatedValues.length === 0) {
        const copy = { ...prev };
        delete copy[filterKey];
        return copy;
      }

      return {
        ...prev,
        [filterKey]: updatedValues,
      };
    });
  };

  const handleResetFilters = () => {
    setSelectedFilters({});
    setSearch("");
    setSort("latest");
  };

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    // 1. Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // 2. Dynamic Specification filters
    const filterKeys = Object.keys(selectedFilters);
    if (filterKeys.length > 0) {
      result = result.filter((product) => {
        const specs = product.specifications || {};

        return filterKeys.every((key) => {
          const selectedValues = selectedFilters[key];
          if (!selectedValues || selectedValues.length === 0) return true;

          // Look up product specification value for this key
          // (check exact key, lowercase key, underscore/hyphen variants)
          const productVal =
            specs[key] ||
            specs[key.toLowerCase()] ||
            specs[key.replace(/_/g, " ")] ||
            specs[key.replace(/\s+/g, "_")] ||
            "";

          const productValStr = String(productVal).toLowerCase().trim();

          // Matches if product spec value matches any of the checked values in this group
          return selectedValues.some((val) => {
            const valLower = String(val).toLowerCase().trim();
            return (
              productValStr === valLower ||
              productValStr.includes(valLower) ||
              valLower.includes(productValStr)
            );
          });
        });
      });
    }

    // 3. Sorting
    if (sort === "a-z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "z-a") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "popular") {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    } else {
      // latest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [categoryProducts, search, selectedFilters, sort]);

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* BREADCRUMB & HEADER */}
      <section className="bg-white border-b border-gray-100 py-8 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto space-y-3">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium flex-wrap">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-blue-600">Catalogue</Link>
            <ChevronRight size={12} />
            <span className="text-[#021C57] font-semibold">
              {categoryData?.name || slug}
            </span>
          </nav>

          {/* Title & Description */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              {categoryData?.equipmentType?.name || "Equipment Category"}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-[#021C57]">
              {categoryData?.name || "Category Products"}
            </h1>
            {categoryData?.description && (
              <p className="text-gray-600 text-sm md:text-base max-w-3xl mt-1.5 leading-relaxed">
                {categoryData.description}
              </p>
            )}
          </div>

        </div>
      </section>

      {/* MAIN CONTAINER */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-10 py-8">
        
        {/* MOBILE FILTER TOGGLE */}
        {categoryData?.filters?.length > 0 && (
          <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 px-4 rounded-2xl text-sm font-semibold text-[#021C57] shadow-xs cursor-pointer"
            >
              <Filter size={16} />
              {mobileDrawerOpen ? "Close Filters" : `Specifications (${activeFilterCount})`}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl text-xs font-semibold hover:bg-gray-200 transition cursor-pointer"
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR: DYNAMIC SPECIFICATION FILTERS */}
          {categoryData?.filters?.length > 0 && (
            <aside
              className={`w-full lg:w-72 shrink-0 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 lg:sticky lg:top-36 ${
                mobileDrawerOpen ? "block" : "hidden lg:block"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-[#021C57] text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Technical Filters
                </h3>

                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <X size={12} /> Clear ({activeFilterCount})
                  </button>
                )}
              </div>

              {categoryData.filters.map((filter) => (
                <div key={filter.key} className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {filter.name}
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {filter.values?.map((val, idx) => {
                      const isChecked =
                        selectedFilters[filter.key]?.includes(val) || false;

                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              handleFilterToggle(filter.key, val)
                            }
                            className="w-4 h-4 rounded-md accent-[#021C57] cursor-pointer"
                          />
                          <span className={isChecked ? "font-bold text-[#021C57]" : ""}>
                            {val}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </aside>
          )}

          {/* MAIN PRODUCTS COLUMN */}
          <div className="flex-1 w-full space-y-6">
            
            {/* TOOLBAR */}
            <ProductToolbar
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
              totalProducts={filteredProducts.length}
              onReset={handleResetFilters}
              hasActiveFilters={Boolean(search || activeFilterCount > 0 || sort !== "latest")}
            />

            {/* LOADING */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-80 bg-white rounded-3xl border border-gray-100 p-4 animate-pulse space-y-4"
                  >
                    <div className="h-44 bg-gray-100 rounded-2xl"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!loading && filteredProducts.length === 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center space-y-3 shadow-xs">
                <h3 className="text-xl font-bold text-gray-700">
                  No Instruments Found
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  No products matched the selected technical attributes or search keywords.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 bg-[#021C57] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#03308f] transition cursor-pointer mt-2"
                  >
                    <RotateCcw size={12} /> Clear Applied Filters
                  </button>
                )}
              </div>
            )}

            {/* PRODUCT GRID */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

          </div>

        </div>
      </section>
    </div>
  );
};

export default CategoryProductPage;
