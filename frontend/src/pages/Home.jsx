import { useEffect, useState, useMemo } from "react";
import Carousel from "../components/Carousel.jsx";
import trustImg from "../assets/why-us/trust.png";
import qualityImg from "../assets/why-us/quality.png";
import supportImg from "../assets/why-us/support.png";
import { NavLink, Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore.js";
import { useCategoryStore } from "../store/useCategoryStore.js";
import { useEquipmentTypeStore } from "../store/useEquipmentTypeStore.js";
import ProductCard from "../components/products/ProductCard.jsx";
import NewsletterSubscription from "../components/common/NewsletterSubscription.jsx";
import FaqSection from "../components/home/FaqSection.jsx";
import { formatTitleCase } from "../utils/stringUtils.js";
import {
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const { products, fetchProducts, loading: productsLoading } = useProductStore();
  const { categories, fetchCategories, loading: categoriesLoading } = useCategoryStore();
  const { equipmentTypes, fetchEquipmentTypes } = useEquipmentTypeStore();

  useEffect(() => {
    // Fetch all active entities in parallel
    Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchEquipmentTypes(),
    ]).catch((err) => console.error("Home data fetch error:", err));
  }, []);

  const loading = productsLoading || categoriesLoading;

  // Build Featured Equipment Types Structure:
  // For each featured Equipment Type -> for each of its Categories -> pick exactly 1 representative product!
  const featuredEquipmentSections = useMemo(() => {
    if (!equipmentTypes || equipmentTypes.length === 0) return [];

    // Filter featured equipment types, or fallback to all active if none are explicitly featured
    let targetTypes = equipmentTypes.filter((eq) => eq.isFeatured);
    if (targetTypes.length === 0) {
      targetTypes = equipmentTypes.slice(0, 3);
    }

    return targetTypes
      .map((eqType) => {
        // Find categories belonging to this Equipment Type
        const eqCategories = categories.filter((cat) => {
          const catEqId = cat.equipmentType?._id || cat.equipmentType;
          return catEqId && String(catEqId) === String(eqType._id);
        });

        // For each category, select only 1 representative product
        const representativeProducts = [];

        eqCategories.forEach((cat) => {
          const catProducts = products.filter((p) => {
            const pCatId = p.category?._id || p.category;
            return pCatId && String(pCatId) === String(cat._id);
          });

          if (catProducts.length > 0) {
            // Prefer featured product in category if available, otherwise first product
            const repProduct = catProducts.find((p) => p.isFeatured) || catProducts[0];
            representativeProducts.push({
              ...repProduct,
              category: cat,
              equipmentTypeName: eqType.name,
            });
          }
        });

        return {
          equipmentType: eqType,
          categoriesCount: eqCategories.length,
          products: representativeProducts,
        };
      })
      .filter((sec) => sec.products.length > 0);
  }, [equipmentTypes, categories, products]);

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

      {/* 2. FEATURED EQUIPMENT TYPES & REPRESENTATIVE PRODUCTS SHOWCASE */}
      <section className="py-16 px-4 md:px-10 lg:px-16 max-w-[1600px] mx-auto space-y-16">
        
        {/* Main Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200/80 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#021C57] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Featured Industry Classifications
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#021C57] tracking-tight">
              Specialized Laboratory Testing Instruments
            </h2>
            
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Explore key flagship instruments organized by industry equipment types. Each category is engineered to national calibration guidelines.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-[#021C57] hover:bg-[#043399] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-2xl transition duration-200 shadow-md shrink-0 self-start md:self-auto cursor-pointer"
          >
            Browse All Catalogue ({products.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-12">
            {[1, 2].map((group) => (
              <div key={group} className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-xl w-64 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
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
              </div>
            ))}
          </div>
        )}

        {/* SECTION-WISE EQUIPMENT TYPES DISPLAY */}
        {!loading && featuredEquipmentSections.length > 0 && (
          <div className="space-y-16">
            {featuredEquipmentSections.map((section) => (
              <div
                key={section.equipmentType._id}
                className="space-y-6 bg-white/60 p-6 sm:p-8 rounded-3xl border border-gray-200/70 shadow-xs"
              >
                {/* Equipment Type Heading Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#021C57] text-white flex items-center justify-center shadow-md">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#021C57] tracking-tight">
                        {formatTitleCase(section.equipmentType.name)}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Showing 1 flagship instrument per category ({section.products.length} categories represented)
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition self-start sm:self-auto cursor-pointer"
                  >
                    View full {formatTitleCase(section.equipmentType.name)} range
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {/* 1 Representative Product per Category Grid */}
                <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {section.products.map((product) => (
                    <div
                      key={product._id}
                      className="shrink-0 w-[280px] sm:w-[310px] lg:w-[320px]"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Fallback if no products/equipment types available */}
        {!loading && featuredEquipmentSections.length === 0 && (
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
