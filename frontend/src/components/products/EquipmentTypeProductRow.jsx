import { useRef, useState, useEffect } from "react";
import { Layers, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard.jsx";
import { formatTitleCase } from "../../utils/stringUtils.js";

const EquipmentTypeProductRow = ({ section, onSelectType }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [section.products]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollDistance = clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollDistance : scrollDistance,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-5 shadow-2xs">
      {/* Section Header with Title & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#021C57] text-white flex items-center justify-center shadow-md shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#021C57] tracking-tight">
              {formatTitleCase(section.equipmentType.name)}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              1 flagship instrument per category ({section.products.length} categories)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Explore All Button */}
          <button
            onClick={() => onSelectType(section.equipmentType._id)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition cursor-pointer"
          >
            <span>Explore All</span>
            <ArrowRight size={13} />
          </button>

          {/* Left & Right Slider Controls */}
          {section.products.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
                title="Scroll Left"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
                title="Scroll Right"
                aria-label="Scroll Right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Single Horizontal Row (Hidden Scrollbar) */}
      <div
        ref={scrollRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 pt-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {section.products.map((product) => (
          <div
            key={product._id}
            className="w-[280px] sm:w-[310px] md:w-[320px] shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentTypeProductRow;
