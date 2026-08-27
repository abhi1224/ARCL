import { useEffect, useState } from "react";
import Carousel from "../components/Carousel.jsx";
import trustImg from "../assets/why-us/trust.png";
import qualityImg from "../assets/why-us/quality.png";
import supportImg from "../assets/why-us/support.png";
import { NavLink, Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore.js";
import { useCategoryStore } from "../store/useCategoryStore.js";
import ProductCard from "../components/products/ProductCard.jsx";
import NewsletterSubscription from "../components/common/NewsletterSubscription.jsx";
import FaqSection from "../components/home/FaqSection.jsx";
import {
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  FileText,
} from "lucide-react";

const Home = () => {
  const { products, fetchProducts, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [activeCategoryTab, setActiveCategoryTab] = useState("all");

  useEffect(() => {
    // Fetch all active products
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter only featured products
  const featuredProducts = products.filter((p) => p.isFeatured);

  // Categorized featured products
  const displayedProducts =
    activeCategoryTab === "all"
      ? featuredProducts
      : featuredProducts.filter(
          (p) =>
            p.category?._id === activeCategoryTab ||
            p.category === activeCategoryTab
        );

  const features = [
    {
      title: "Trusted by Industry Experts",
      description:
        "We have built a reputation of reliability and professionalism, trusted by laboratories, universities, and industries across the nation.",
      image: trustImg,
    },
    {
      title: "Top-Quality Precision Equipment",
      description:
        "Our instruments comply with stringent ISO standards and are rigorously calibrated to ensure the highest testing precision.",
      image: qualityImg,
    },
    {
      title: "Dedicated Technical Support",
      description:
        "We provide comprehensive technical support, calibration assistance, and guidance for seamless operation.",
      image: supportImg,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* 1. HERO CAROUSEL */}
      <Carousel />

      {/* 2. FEATURED PRODUCTS SHOWCASE SECTION */}
      <section className="py-16 px-4 md:px-10 lg:px-16 max-w-[1600px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200/80 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Laboratory Instruments
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#021C57] tracking-tight">
              Flagship Testing & Analytical Equipment
            </h2>
            
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Explore our premium range of precision instruments engineered to international testing and ISO quality benchmarks.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-[#021C57] hover:bg-[#043399] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-2xl transition duration-200 shadow-md shrink-0 self-start md:self-auto cursor-pointer"
          >
            Explore Full Catalogue ({products.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs Filter */}
        {categories.length > 0 && featuredProducts.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategoryTab("all")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeCategoryTab === "all"
                  ? "bg-[#021C57] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Featured ({featuredProducts.length})
            </button>

            {categories.map((cat) => {
              const catFeaturedCount = featuredProducts.filter(
                (p) =>
                  p.category?._id === cat._id || p.category === cat._id
              ).length;

              if (catFeaturedCount === 0) return null;

              return (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategoryTab(cat._id)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeCategoryTab === cat._id
                      ? "bg-[#021C57] text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {cat.name} ({catFeaturedCount})
                </button>
              );
            })}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-84 bg-white rounded-3xl border border-gray-100 p-4 animate-pulse space-y-4 shadow-xs"
              >
                <div className="h-48 bg-gray-100 rounded-2xl w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* FEATURED PRODUCTS RESPONSIVE GRID */}
        {!loading && displayedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Fallback if no featured products yet */}
        {!loading && displayedProducts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-blue-50 text-[#021C57] rounded-full flex items-center justify-center mx-auto">
              <Layers size={30} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Explore Our Comprehensive Catalogue
            </h3>
            <p className="text-gray-500 text-sm">
              Browse our full inventory of civil, mechanical, scientific, and testing laboratory equipment.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#021C57] text-white px-7 py-3 rounded-2xl font-semibold hover:bg-[#03308f] transition text-xs shadow-md"
            >
              Browse All Products <ArrowRight size={14} />
            </Link>
          </div>
        )}

      </section>

      {/* 3. NEWSLETTER / EQUIPMENT ALERT SUBSCRIPTION */}
      <NewsletterSubscription />

      {/* 4. WHY CHOOSE ARCL */}
      <section className="py-16 px-6 md:px-16 bg-white text-[#021C57] border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award size={14} /> ISO 9001:2015 Certified
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose ARCL</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            We deliver exceptional precision, comprehensive ISO compliance, and reliable engineering solutions tailored to your laboratory requirements.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:shadow-lg hover:bg-white hover:border-gray-200 transition-all duration-300 flex flex-col items-center text-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-contain mb-6"
              />
              <h3 className="text-xl font-bold text-[#021C57] mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ SECTION) */}
      <FaqSection />

      {/* 6. GLOBAL INTERACTION CTA */}
      <section className="w-full bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#021C57] to-[#043399] rounded-3xl shadow-xl p-8 md:p-14 text-center text-white space-y-6">
          <h2 className="text-2xl md:text-4xl font-bold leading-snug">
            Need Custom Laboratory Equipment or Calibration?
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto">
            Our engineering specialists are ready to help you configure testing instruments according to national & international standards.
          </p>
          <div className="pt-2">
            <NavLink
              to="/contact"
              className="inline-block bg-white hover:bg-gray-100 text-[#021C57] font-bold px-8 py-3.5 rounded-2xl shadow-lg transition duration-300 text-sm md:text-base"
            >
              Contact Our Engineers
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
