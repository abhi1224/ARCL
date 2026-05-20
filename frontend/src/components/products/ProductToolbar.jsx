import { Search } from "lucide-react";

const ProductToolbar = ({
  search,
  setSearch,
  sort,
  setSort,
  totalProducts,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sticky top-20 z-20 shadow-sm">

      {/* SEARCH */}
      <div className="relative w-full lg:max-w-md">

        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search equipment..."
          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 flex-wrap">

        <p className="text-sm text-gray-500">
          {totalProducts} Products
        </p>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 outline-none"
        >
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="a-z">A-Z</option>
        </select>
      </div>
    </div>
  );
};

export default ProductToolbar;