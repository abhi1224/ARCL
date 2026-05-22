import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Check, Mail, X, Package } from "lucide-react";

import { useProductStore } from "../store/useProductStore.js";

import { useInquiryStore } from "../store/useInquiryStore.js";

const ProductDetailsPage = () => {
  const { slug } = useParams();

  // PRODUCT STORE

  const { product, loading, error, fetchSingleProduct } = useProductStore();

  // INQUIRY STORE

  const { createInquiry, loading: inquiryLoading } = useInquiryStore();

  // MODAL STATE

  const [openQuoteModal, setOpenQuoteModal] = useState(false);

  // FORM STATE

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    company: "",
    quantity: 1,
    message: "",
  });

  // FETCH PRODUCT

  useEffect(() => {
    fetchSingleProduct(slug);
  }, [slug]);

  // PREVENT BODY SCROLL

  useEffect(() => {
    if (openQuoteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openQuoteModal]);

  // HANDLE CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createInquiry({
        product: product._id,

        productName: product.name,

        productSlug: product.slug,

        category: product.category?.name,

        ...formData,
      });

      alert("Inquiry submitted successfully");

      setOpenQuoteModal(false);

      setFormData({
        customerName: "",
        email: "",
        phone: "",
        company: "",
        quantity: 1,
        message: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // LOADING

  if (loading) {
    return (
      <div
        className="
      min-h-screen
      flex
      items-center
      justify-center
      text-xl
      font-semibold
    "
      >
        Loading Product...
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
      text-xl
      font-semibold
    "
      >
        {error}
      </div>
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
                  {product.features.map((feature, index) => (
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
                  {product.applications.map((item, index) => (
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

                      <span className="text-gray-700">{item}</span>
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
              {/* REQUEST QUOTE */}

              <button
                onClick={() => setOpenQuoteModal(true)}
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

              {/* WHATSAPP */}

              <a
                href={`https://wa.me/919369962486?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(
                  product.name,
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
          Object.keys(product.specifications).length > 0 && (
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
                {Object.entries(product.specifications).map(([key, value]) => (
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

                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* REQUEST QUOTE MODAL */}

        {openQuoteModal && (
          <div
            className="
          fixed
          inset-0
          z-50
          bg-black/60
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-4
        "
          >
            <div
              className="
            relative
            bg-white
            rounded-3xl
            w-full
            max-w-5xl
            max-h-[95vh]
            overflow-y-auto
            shadow-2xl
          "
            >
              {/* CLOSE */}

              <button
                onClick={() => setOpenQuoteModal(false)}
                className="
              absolute
              top-5
              right-5
              z-10
              h-10
              w-10
              rounded-full
              bg-gray-100
              hover:bg-red-100
              flex
              items-center
              justify-center
            "
              >
                <X className="w-5 h-5" />
              </button>

              <div
                className="
              grid
              grid-cols-1
              lg:grid-cols-2
            "
              >
                {/* LEFT */}

                <div
                  className="
                bg-gray-50
                p-8
                border-r
                border-gray-100
              "
                >
                  <div
                    className="
                  rounded-3xl
                  overflow-hidden
                  bg-white
                "
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="
                    w-full
                    h-[350px]
                    object-cover
                  "
                    />
                  </div>

                  <div className="mt-6">
                    <span
                      className="
                    inline-block
                    bg-[#021C57]
                    text-white
                    text-xs
                    px-4
                    py-2
                    rounded-full
                    mb-4
                  "
                    >
                      {product.category?.name}
                    </span>

                    <h2
                      className="
                    text-3xl
                    font-bold
                    text-[#021C57]
                  "
                    >
                      {product.name}
                    </h2>

                    <p
                      className="
                    mt-4
                    text-gray-600
                    leading-relaxed
                  "
                    >
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* RIGHT FORM */}

                <div className="p-8">
                  <div className="mb-8">
                    <div
                      className="
                    flex
                    items-center
                    gap-3
                    mb-4
                  "
                    >
                      <div
                        className="
                      h-12
                      w-12
                      rounded-2xl
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                    "
                      >
                        <Package
                          className="
                        w-6
                        h-6
                        text-[#021C57]
                      "
                        />
                      </div>

                      <div>
                        <h2
                          className="
                        text-3xl
                        font-bold
                        text-[#021C57]
                      "
                        >
                          Request Quote
                        </h2>

                        <p className="text-gray-500">
                          Fill the form to get pricing details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FORM */}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* NAME */}

                    <input
                      type="text"
                      name="customerName"
                      placeholder="Full Name"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="
                    w-full
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                  "
                    />

                    {/* EMAIL */}

                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="
                    w-full
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                  "
                    />

                    {/* PHONE */}

                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="
                    w-full
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                  "
                    />

                    {/* COMPANY */}

                    <input
                      type="text"
                      name="company"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={handleChange}
                      className="
                    w-full
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                  "
                    />

                    {/* QUANTITY */}

                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="
                    w-full
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                  "
                    />

                    {/* MESSAGE */}

                    <textarea
                      rows="5"
                      name="message"
                      placeholder="
                    Tell us your requirements...
                  "
                      value={formData.message}
                      onChange={handleChange}
                      className="
                    w-full
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                    resize-none
                  "
                    />

                    {/* BUTTON */}

                    <button
                      type="submit"
                      disabled={inquiryLoading}
                      className="
                    w-full
                    bg-[#021C57]
                    hover:bg-[#03308f]
                    text-white
                    py-4
                    rounded-2xl
                    font-semibold
                    transition-all
                    duration-300
                  "
                    >
                      {inquiryLoading ? "Submitting..." : "Submit Inquiry"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
