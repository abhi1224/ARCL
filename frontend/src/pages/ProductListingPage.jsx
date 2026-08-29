import { useEffect, useState, useMemo, useRef } from "react";
import ProductSidebar from "../components/products/ProductSidebar.jsx";
import ProductToolbar from "../components/products/ProductToolbar.jsx";
import ProductCard from "../components/products/ProductCard.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";

import { useProductStore } from "../store/useProductStore.js";
import { useCategoryStore } from "../store/useCategoryStore.js";
import { useEquipmentTypeStore } from "../store/useEquipmentTypeStore.js";
import { Filter, RotateCcw, Layers, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { formatTitleCase } from "../utils/stringUtils.js";
import { Link } from "react-router-dom";

const ProductListingPage = () => {
  const { products, fetchProducts, loading: productsLoading } = useProductStore();
  const { categories, fetchCategories, loading: categoriesLoading } = useCategoryStore();
  const { equipmentTypes, fetchEquipmentTypes, loading: eqTypesLoading } = useEquipmentTypeStore();

  const [search, setSearch] = useState("");
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("");
  const [sort, setSort] = useState("latest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Progressive scroll-based loading state for section-wise view (number of sections visible)
  const [visibleSectionsCount, setVisibleSectionsCount] = useState(2);
  const bottomSentinelRef = useRef(null);

  useEffect(() => {
    // Fetch all catalog data in parallel
    Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchEquipmentTypes(),
    ]).catch((err) => console.error("Catalogue fetch error:", err));
  }, []);

  // Fetch filtered products from backend whenever base search/type/sort change
  useEffect(() => {
    if (selectedEquipmentType || search || sort !== "latest") {
      fetchProducts({
        search,
        equipmentType: selectedEquipmentType,
        sort,
      });
    }
  }, [search, selectedEquipmentType, sort]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedEquipmentType("");
    setSort("latest");
    setVisibleSectionsCount(2);
  };

  const hasActiveFilters = Boolean(
    search || selectedEquipmentType || sort !== "latest"
  );

  const loading = productsLoading || categoriesLoading || eqTypesLoading;

  // Build Section-Wise Structure: For each Equipment Type -> 1 Product per Category
  const equipmentTypeSections = useMemo(() => {
    if (!equipmentTypes || equipmentTypes.length === 0) return [];

    return equipmentTypes
      .map((eqType) => {
        // Find categories belonging to this Equipment Type
        const eqCategories = categories.filter((cat) => {
          const catEqId = cat.equipmentType?._id || cat.equipmentType;
          return catEqId && String(catEqId) === String(eqType._id);
        });

        // For each category, select only 1 representative product
        const representativeProducts = [];

        eqCategories.forEach((cat) => {
          const catProducts = products.filter((p) => {
            const pCatId = p.category?._id || p.category;
            return pCatId && String(pCatId) === String(cat._id);
          });

          if (catProducts.length > 0) {
            const repProduct = catProducts.find((p) => p.isFeatured) || catProducts[0];
            representativeProducts.push({
              ...repProduct,
              category: cat,
              equipmentTypeName: eqType.name,
            });
          }
        });

        return {
          equipmentType: eqType,
          categoriesCount: eqCategories.length,
          products: representativeProducts,
        };
      })
      .filter((sec) => sec.products.length > 0);
  }, [equipmentTypes, categories, products]);

  // Infinite/Progressive on-scroll observer for section-wise view
  useEffect(() => {
    if (hasActiveFilters || visibleSectionsCount >= equipmentTypeSections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleSectionsCount((prev) =>
            Math.min(prev + 1, equipmentTypeSections.length)
          );
        }
      },
      { threshold: 0.2 }
    );

    if (bottomSentinelRef.current) {
      observer.observe(bottomSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasActiveFilters, visibleSectionsCount, equipmentTypeSections.length]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-white border-b border-gray-100 py-10 px-4 md:px-8 text-center">
        <div className="max-w-[1600px] mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#021C57] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Complete Testing Inventory
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#021C57]">
            Laboratory Equipment Catalogue
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Browse our full spectrum of testing instruments organized section-wise by industry classifications and categories.
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
          <div className="flex-1 w-full space-y-8">
            <ProductToolbar
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
              totalProducts={products.length}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* CASE A: USER HAS APPLIED SEARCH OR DIRECT FILTERS -> SHOW FILTERED GRID */}
            {hasActiveFilters ? (
              <ProductGrid products={products} loading={loading} />
            ) : (
              /* CASE B: DEFAULT VIEW -> SECTION-WISE BY EQUIPMENT TYPE (1 PRODUCT PER CATEGORY) */
              <div className="space-y-12">
                {equipmentTypeSections.slice(0, visibleSectionsCount).map((section) => (
                  <div
                    key={section.equipmentType._id}
                    className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-2xs"
                  >
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#021C57] text-white flex items-center justify-center shadow-md">
                          <Layers size={18} />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-[#021C57] tracking-tight">
                            {formatTitleCase(section.equipmentType.name)}
                          </h2>
                          <p className="text-xs text-gray-500 font-medium">
                            1 representative product per category ({section.products.length} categories represented)
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedEquipmentType(section.equipmentType._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100 transition cursor-pointer self-start sm:self-auto"
                      >
                        Explore all in {formatTitleCase(section.equipmentType.name)}
                        <ArrowRight size={13} />
                      </button>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                      {section.products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}

                {/* SCROLL SENTINEL / LOAD MORE FOR ON-SCROLL PROGRESSIVE LOADING */}
                {visibleSectionsCount < equipmentTypeSections.length && (
                  <div
                    ref={bottomSentinelRef}
                    className="text-center py-6 flex flex-col items-center justify-center space-y-3"
                  >
                    <button
                      onClick={() =>
                        setVisibleSectionsCount((prev) =>
                          Math.min(prev + 1, equipmentTypeSections.length)
                        )
                      }
                      className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 text-[#021C57] text-xs font-bold px-6 py-3 rounded-2xl shadow-xs transition cursor-pointer"
                    >
                      <ChevronDown size={14} className="animate-bounce" />
                      Load More Equipment Types ({visibleSectionsCount} of {equipmentTypeSections.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProductListingPage;