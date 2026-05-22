import { useEffect, useMemo, useState } from "react";

import { useParams } from "react-router-dom";

import ProductCard from "../components/products/ProductCard.jsx";

import { useProductStore } from "../store/useProductStore.js";

const CategoryProductsPage = () => {
  const { slug } = useParams();

  const {
    categoryProducts,

    categoryData,

    fetchProductsByCategory,

    loading,

    error,
  } = useProductStore();

  // FILTER STATE

  const [selectedFilters, setSelectedFilters] = useState({});

  // FETCH PRODUCTS

  useEffect(() => {
    fetchProductsByCategory(slug);
  }, [slug, fetchProductsByCategory]);

  // HANDLE FILTER CHANGE

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => {
      const current = prev[key] || [];

      return {
        ...prev,

        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  // FILTER PRODUCTS

  const filteredProducts = useMemo(() => {
    return (categoryProducts || []).filter((product) => {
      return Object.entries(selectedFilters).every(([key, values]) => {
        // NO FILTER SELECTED

        if (values.length === 0) {
          return true;
        }

        const productValue = product[key];

        // ARRAY FIELD

        if (Array.isArray(productValue)) {
          return values.some((value) => productValue.includes(value));
        }

        // SINGLE FIELD

        return values.includes(productValue);
      });
    });
  }, [categoryProducts, selectedFilters]);

  // LOADING

  if (loading) {
    return (
      <div
        className="
      min-h-screen
      flex
      items-center
      justify-center
    "
      >
        Loading products...
      </div>
    );
  }

  // ERROR

  if (error) {
    return (
      <div
        className="
      min-h-screen
      flex
      items-center
      justify-center
      text-red-500
    "
      >
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div
        className="
      max-w-[1600px]
      mx-auto
      px-4
      md:px-8
      py-10
    "
      >
        <div
          className="
        flex
        flex-col
        lg:flex-row
        gap-8
      "
        >
          {/* FILTER SIDEBAR */}

          <aside
            className="
          lg:w-[320px]
          shrink-0
        "
          >
            <div
              className="
            bg-white
            rounded-3xl
            border
            border-gray-100
            p-6
            space-y-8
            sticky
            top-5
          "
            >
              {/* FILTERS */}

              {categoryData?.filters?.map((filter) => (
                <div key={filter.key}>
                  <h2
                    className="
                    text-xl
                    font-semibold
                    text-[#021C57]
                    mb-5
                  "
                  >
                    {filter.name}
                  </h2>

                  <div className="space-y-3">
                    {filter.values.map((value) => (
                      <label
                        key={value}
                        className="
                          flex
                          items-center
                          gap-3
                          cursor-pointer
                        "
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters[filter.key]?.includes(value) ||
                            false
                          }
                          onChange={() => handleFilterChange(filter.key, value)}
                        />

                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* PRODUCTS */}

          <div className="flex-1">
            {/* HEADER */}

            <div
              className="
            flex
            items-center
            justify-between
            mb-8
          "
            >
              <div>
                <h1
                  className="
                text-4xl
                font-bold
                text-[#021C57]
              "
                >
                  {categoryData?.name || "Category Products"}
                </h1>

                <p className="text-gray-500 mt-2">
                  Showing {filteredProducts.length} products
                </p>
              </div>
            </div>

            {/* EMPTY STATE */}

            {filteredProducts.length === 0 ? (
              <div
                className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                py-20
                text-center
              "
              >
                <h2
                  className="
                  text-2xl
                  font-bold
                  text-[#021C57]
                "
                >
                  No products found
                </h2>
              </div>
            ) : (
              <div
                className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-6
              "
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsPage;
