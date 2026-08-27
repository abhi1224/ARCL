import { Link } from "react-router-dom";
import {
  FaEdit,
  FaStar,
  FaLayerGroup,
  FaCalendarAlt,
  FaSlidersH,
} from "react-icons/fa";
import { X } from "lucide-react";

const CategoryDetailsModal = ({ isOpen, onClose, category }) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 relative animate-scale-up">
        
        {/* MODAL HEADER */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 p-2 rounded-xl text-sm font-bold">
              <FaLayerGroup />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                Category Details
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                ID: {category._id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* HEADER INFO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#021C57] text-white text-xs font-semibold px-3 py-1 rounded-full">
                {category.equipmentType?.name || "Equipment Type"}
              </span>

              {category.isFeatured && (
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <FaStar size={10} className="text-amber-500" /> Featured Category
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 leading-snug">
              {category.name}
            </h3>

            <p className="text-xs text-gray-400 font-mono">
              Slug: <span className="text-blue-600">/categories/{category.slug}</span>
            </p>

            <p className="text-sm text-gray-600 leading-relaxed pt-1">
              {category.description || "No category description provided."}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <FaCalendarAlt size={11} /> Created:{" "}
                {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* DYNAMIC SPECIFICATION FILTERS */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-[#021C57] flex items-center gap-2 border-b border-gray-100 pb-2">
              <FaSlidersH size={14} className="text-blue-600" />
              Dynamic Specifications Filters ({category.filters?.length || 0})
            </h4>

            {category.filters && category.filters.length > 0 ? (
              <div className="space-y-3">
                {category.filters.map((filter, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">
                        {filter.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Key: {filter.key}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {filter.values && filter.values.length > 0 ? (
                        filter.values.map((val, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg shadow-2xs font-medium"
                          >
                            {val}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Custom free-text input allowed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-xl">
                No dynamic specification filters defined for this category.
              </p>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-100 rounded-b-3xl flex items-center justify-between gap-4">
          <Link
            to={`/categories/${category.slug}`}
            target="_blank"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Open Category Storefront Page →
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Close
            </button>

            <Link
              to={`/admin/categories/edit/${category.slug}`}
              className="inline-flex items-center gap-2 bg-[#021C57] hover:bg-[#03308f] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
            >
              <FaEdit size={12} /> Edit Category
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoryDetailsModal;
