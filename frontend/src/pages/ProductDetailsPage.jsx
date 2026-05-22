import { useEffect } from "react";

import { useParams } from "react-router-dom";

import {
Check,
Mail,
} from "lucide-react";

import { useProductStore }
from "../store/useProductStore.js";

const ProductDetailsPage = () => {

const { slug } = useParams();
console.log(slug);


const {
product,
loading,
error,
fetchSingleProduct,
} = useProductStore();

useEffect(() => {
fetchSingleProduct(slug);
}, [slug]);

// LOADING

if (loading) {
return ( <div
     className="
       min-h-screen
       flex
       items-center
       justify-center
       text-xl
       font-semibold
     "
   >
Loading Product... </div>
);
}

// ERROR

if (error) {
return ( <div
     className="
       min-h-screen
       flex
       items-center
       justify-center
       text-red-500
       text-xl
       font-semibold
     "
   >
{error} </div>
);
}

// NO PRODUCT

if (!product) return null;

return (

<div className="bg-gray-50 min-h-screen">

  <div
    className="
      max-w-[1500px]
      mx-auto
      px-4
      md:px-8
      py-10
    "
  >

    {/* TOP SECTION */}

    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-10
      "
    >

      {/* LEFT IMAGE */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-100
          overflow-hidden
          shadow-sm
        "
      >

        <img
          src={product.images?.[0]}
          alt={product.name}
          className="
            w-full
            h-full
            object-cover
          "
        />

      </div>

      {/* RIGHT CONTENT */}

      <div className="space-y-6">

        {/* CATEGORY */}

        <span
          className="
            inline-block
            bg-[#021C57]
            text-white
            text-sm
            px-4
            py-2
            rounded-full
          "
        >
          {product.category?.name}
        </span>

        {/* TITLE */}

        <h1
          className="
            text-3xl
            md:text-5xl
            font-bold
            text-[#021C57]
            leading-tight
          "
        >
          {product.name}
        </h1>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-600
            leading-relaxed
            text-lg
          "
        >
          {product.description}
        </p>

        {/* FEATURES */}

        {product.features?.length > 0 && (

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-[#021C57]
                mb-4
              "
            >
              Key Features
            </h2>

            <div className="flex flex-wrap gap-3">

              {product.features.map(
                (feature, index) => (

                <span
                  key={index}
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-blue-50
                    text-[#021C57]
                    text-sm
                    font-medium
                  "
                >
                  {feature}
                </span>

              ))}

            </div>

          </div>

        )}

        {/* APPLICATIONS */}

        {product.applications?.length > 0 && (

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-[#021C57]
                mb-4
              "
            >
              Applications
            </h2>

            <div className="space-y-3">

              {product.applications.map(
                (item, index) => (

                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <Check
                    className="
                      w-5
                      h-5
                      text-green-500
                    "
                  />

                  <span className="text-gray-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* BUTTONS */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-4
            pt-4
          "
        >

          <button
            className="
              flex-1
              bg-[#021C57]
              hover:bg-[#03308f]
              text-white
              py-4
              rounded-2xl
              font-medium
              transition-all
              duration-300
            "
          >
            Request Quote
          </button>

          <a
            href={`https://wa.me/919369962486?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(
              product.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex-1
              border
              border-gray-200
              hover:border-[#021C57]
              hover:text-blue-600
              rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              transition-all
              duration-300
              bg-white
              py-4
            "
          >

            <Mail className="w-5 h-5" />

            WhatsApp Inquiry

          </a>

        </div>

      </div>

    </div>

    {/* SPECIFICATIONS */}

    {product.specifications &&
      Object.keys(product.specifications)
        .length > 0 && (

      <section
        className="
          mt-16
          bg-white
          rounded-3xl
          border
          border-gray-100
          p-8
          shadow-sm
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            text-[#021C57]
            mb-8
          "
        >
          Specifications
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          {Object.entries(
            product.specifications
          ).map(([key, value]) => (

            <div
              key={key}
              className="
                flex
                justify-between
                items-center
                border
                border-gray-100
                rounded-2xl
                p-5
              "
            >

              <span
                className="
                  font-semibold
                  text-[#021C57]
                "
              >
                {key}
              </span>

              <span className="text-gray-600">
                {value}
              </span>

            </div>

          ))}

        </div>

      </section>

    )}

  </div>

</div>


);
};

export default ProductDetailsPage;
