import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

const ProductCard = ({ product }) => {
  return (

<div
  className="
    group
    bg-white
    rounded-3xl
    border border-gray-100
    overflow-hidden
    transition-all
    duration-300
    flex
    flex-col
  "
>
  {/* IMAGE */}
  <div
    className="
      relative
      overflow-hidden
      bg-gray-100
      h-52
      sm:h-56
      md:h-60
    "
  >
    <img
      src={product.images}
      alt={product.name}
      className="
        w-full
        h-full
        object-cover
        group-hover:scale-105
        transition-transform
        duration-500
      "
    />

    <span
      className="
        absolute
        top-3
        left-3
        bg-[#021b57c5]
        text-white
        text-xs
        px-4
        py-1
        rounded-full
        shadow-lg
        font-medium
      "
    >
      {product.category?.name || "Equipment"}
    </span>
  </div>

  {/* CONTENT */}
  <div className="p-5">
    {/* TITLE */}
    <Link
      to={`/products/${product.slug}`}
      className="
        text-lg
        md:text-xl
        font-bold
        text-[#021C57]
        line-clamp-2
        hover:text-blue-600
        transition
        block
        min-h-[56px]
      "
    >
      {product.name}
    </Link>
    
    

    {/* BUTTONS */}
    <div
      className="
        mt-4
        flex
        flex-col
        sm:flex-row
        gap-3
      "
    >
      <Link
        to={`/products/${product.slug}`}
        className="
          flex-1
          bg-[#021C57]
          hover:bg-blue-700
          text-white
          py-3
          rounded-xl
          font-medium
          flex
          items-center
          justify-center
          gap-2
          transition-all
          duration-300
          shadow-md
          text-sm
        "
      >
        View Details
        <ArrowRight className="w-4 h-4" />
      </Link>

      <a
        href={`https://wa.me/919369962486?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(
          product.name
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          px-5
          py-3
          border
          border-gray-200
          hover:border-blue-500
          hover:text-blue-600
          rounded-xl
          flex
          items-center
          justify-center
          transition-all
          duration-300
          bg-white
        "
      >
        <Mail className="w-5 h-5" />
      </a>
    </div>
  </div>
</div>


  );
};

export default ProductCard;

