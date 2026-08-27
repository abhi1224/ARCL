import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, FileText, Sparkles,ArrowUpRight, FileDown, CheckCircle2  } from "lucide-react";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const imageUrl =
    Array.isArray(product.images) && product.images[0]
      ? product.images[0]
      : typeof product.images === "string"
      ? product.images
      : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600";

  // Quick specs array for preview pills
  const specsEntries = product.specifications
    ? Object.entries(product.specifications).slice(0, 2)
    : [];

  return (
    <div className="group relative flex flex-col justify-between h-full bg-white rounded-3xl border border-slate-100 hover:border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(2,28,87,0.14)] transition-all duration-500 ease-out hover:-translate-y-1.5 overflow-hidden">
      
      {/* Top Subtle Hover Accent Gradient */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#021C57] via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      <div>
        {/* ================= 1. CLEAN TOP IMAGE CONTAINER ================= */}
        <div className="relative aspect-[4/3] sm:h-56 w-full overflow-hidden bg-slate-50">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600";
            }}
          />
          {/* Soft Bottom Shadow for Image Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          {/* Top Floating Badge (Sirf Featured yahan rahega, agar active ho) */}
          {product.isFeatured && (
            <div className="absolute top-3.5 right-3.5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-amber-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 shadow-md border border-amber-200/80">
                <Sparkles size={11} className="text-amber-800 animate-pulse" />
                Featured
              </span>
            </div>
          )}
        </div>
        {/* ================= 2. CARD CONTENT ================= */}
        <div className="p-5 sm:p-6 space-y-3">
          
          {/* ✨ NAYI JAGAH: Category Badge (Overline Pill with Dot Indicator) */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#021C57] bg-blue-50/80 border border-blue-100/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#021C57] animate-pulse" />
              {product.category?.name || "Equipment"}
            </span>
            {/* Optional SKU or Stock preview if available */}
            {product.sku && (
              <span className="text-[10px] font-mono text-slate-400">
                #{product.sku}
              </span>
            )}
          </div>
          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="group/title flex items-start justify-between gap-2 text-base sm:text-[17px] font-bold text-slate-900 group-hover:text-[#021C57] transition-colors leading-snug line-clamp-2 min-h-[46px]"
          >
            <span>{product.name}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover/title:text-[#021C57] group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0 mt-1" />
          </Link>
          {/* Description */}
          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
              {product.description}
            </p>
          )}
          {/* Quick Specifications Preview Chips */}
          {specsEntries.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {specsEntries.slice(0, 3).map(([k, v], idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-400 font-normal">{k}:</span>
                  <span className="font-semibold truncate max-w-[85px]">{String(v)}</span>
                </div>
              ))}
              {specsEntries.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-medium text-slate-400 border border-dashed border-slate-200">
                  +{specsEntries.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {/* ================= 3. ACTION BUTTONS ROW ================= */}
      <div className="p-5 sm:p-6 pt-0">
        <div className="pt-3.5 border-t border-slate-100 flex flex-col gap-2">
          
          {/* Main Action (View Details + WhatsApp) */}
          <div className="flex items-center gap-2">
            {/* View Details Primary Button */}
            <Link
              to={`/products/${product.slug}`}
              className="flex-1 group/btn py-2.5 px-4 bg-[#021C57] hover:bg-[#032980] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#021C57]/20 active:scale-[0.98]"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/918169695728?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(
                product.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Quote"
              className="group/wa p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 hover:border-emerald-600 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 shadow-xs hover:shadow-emerald-500/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 transition-colors duration-300" />
            </a>
          </div>
          {/* PDF Catalog Brochure */}
          <Link
            to={`/products/${product.slug}/catalog`}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50/60 text-slate-600 hover:text-[#021C57] border border-slate-200/70 hover:border-blue-200/80 rounded-xl text-[11px] font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99]"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>PDF Catalog Brochure</span>
          </Link>
        </div>
      </div>
    </div>

  );
};

export default ProductCard;
