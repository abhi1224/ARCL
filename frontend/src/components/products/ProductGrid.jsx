import ProductCard from "./ProductCard.jsx";

const ProductGrid = ({ products, loading }) => {

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[420px] bg-white rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          No Products Found
        </h2>

        <p className="text-gray-500 mt-3">
          Try changing filters or search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start ">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;