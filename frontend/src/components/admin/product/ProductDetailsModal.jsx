import { Link } from "react-router-dom";
import {
  FaEdit,
  FaCheck,
  FaTimes,
  FaStar,
  FaLayerGroup,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import { X, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const imageUrl =
    Array.isArray(product.images) && product.images[0]
      ? product.images[0]
      : typeof product.images === "string"
      ? product.images
      : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100 relative animate-scale-up">
        
        {/* MODAL HEADER */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-[#021C57] p-2 rounded-xl text-sm font-bold">
              <FaTag />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                Product Details
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                ID: {product._id}
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
        <div className="p-6 md:p-8 space-y-8">
          
          {/* TOP SECTION: IMAGE & PRIMARY INFO */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image */}
            <div className="md:col-span-4 bg-gray-50 rounded-2xl border border-gray-200 p-2 overflow-hidden flex items-center justify-center">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-56 object-cover rounded-xl"
              />
            </div>

            {/* Main Info */}
            <div className="md:col-span-8 space-y-3">
              
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#021C57] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <FaLayerGroup size={11} /> {product.category?.name || "Equipment"}
                </span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                    product.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.isActive ? <FaCheck size={10} /> : <FaTimes size={10} />}
                  {product.isActive ? "Active (Live)" : "Inactive (Hidden)"}
                </span>

                {product.isFeatured && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <FaStar size={10} className="text-amber-500" /> Featured Item
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h3>

              {/* Slug */}
              <p className="text-xs text-gray-400 font-mono">
                Slug: <span className="text-blue-600">/products/{product.slug}</span>
              </p>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed pt-1">
                {product.description || "No description provided."}
              </p>

              {/* Timestamps */}
              <div className="pt-2 flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt size={11} /> Created:{" "}
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>

            </div>

          </div>

          {/* TECHNICAL SPECIFICATIONS */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#021C57] flex items-center gap-2 border-b border-gray-100 pb-2">
                  <ShieldCheck size={16} className="text-blue-600" /> Technical Specifications
                </h4>

                <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs sm:text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                      <tr>
                        <th className="p-3 border-b border-gray-200 w-1/2">Attribute</th>
                        <th className="p-3 border-b border-gray-200 w-1/2">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.entries(product.specifications).map(
                        ([key, val], idx) => (
                          <tr
                            key={key}
                            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                          >
                            <td className="p-3 font-semibold text-gray-700">
                              {key}
                            </td>
                            <td className="p-3 text-gray-900">{String(val)}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* FEATURES & APPLICATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2">
                <h4 className="text-xs font-bold text-[#021C57] uppercase tracking-wider">
                  Key Features ({product.features.length})
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applications */}
            {product.applications && product.applications.length > 0 && (
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Applications ({product.applications.length})
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {product.applications.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-100 rounded-b-3xl flex items-center justify-between gap-4">
          <Link
            to={`/products/${product.slug}/catalog`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <FileText size={14} /> Open Live Catalog (PDF)
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Close
            </button>

            <Link
              to={`/admin/products/edit/${product._id}`}
              className="inline-flex items-center gap-2 bg-[#021C57] hover:bg-[#03308f] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
            >
              <FaEdit size={12} /> Edit Product
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsModal;
