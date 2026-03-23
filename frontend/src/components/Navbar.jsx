import { ArrowRight, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/LOGO.png";
import { FaPhoneAlt } from "react-icons/fa";
import "../index.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Laboratry Equipments", to: "/products" },
    { name: "Scientific Equipments", to: "/scientific-equipment" },
    { name: "Contact", to: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search for:", query);
  };
  const [quoteForm, setQuoteForm] = useState(false);


  return (
    <>
      <header className="h-30 w-full">
        <div className="fixed top-0 left-0 right-0 z-50 h-30 bg-white">
          <div className="upper-layer h-1/2 flex justify-between items-center bg-zinc-100 shadow-2xs px-5">
            <form
              onSubmit={handleSearch}
              className="relative max-w-xs w-full rounded-md overflow-hidden bg-white"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border rounded-md border-gray-300 focus:outline focus:ring-2 focus:ring-[#021C57] text-sm"
              />
              <button
                type="submit"
                className=" button-style absolute right-0 top-0 bottom-0 px-3"
              >
                Search
              </button>
            </form>
            <div className="flex justify-center items-center gap-5">
              <a
                className="text-[#021C57] md:block font-semibold hover:underline transition"
                href="tel:+918169695728"
              >
                <span className="hidden md:block"> Call +91 8169695728 </span>
                <FaPhoneAlt className="md:hidden w-10 h-10 rounded-full hover:bg-[#021C57] transition border-2 p-1.5" />
              </a>

              <button 
                onClick={() => setQuoteForm(true)}
                className="button-style hidden rounded-md font-semibold px-4 py-2 md:flex items-center gap-2 transition">
                Request Quote <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex justify-between items-center h-1/2 px-5 py-3.5 shadow-md shadow-black/50">
            <div className="flex justify-between items-center w-full">
              {/* Logo */}
              <div className="logo-section">
                <Link to="/" className="flex items-center justify-center gap-2">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-20 mix-blend-darken"
                  />

                  <div className="flex flex-col text-[#021C57]">
                    <p className=" font-semibold font-saira">
                      ARCL INSTRUMENTS PVT. LTD
                    </p>
                    <p className="text-[8px] md:text-[10px] text-center">
                      ( An ISO 9001:2025 Certified Company )
                    </p>
                  </div>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.to}
                    className={({ isActive }) =>
                      `font-medium px-2 py-1 transition-all ${
                        isActive
                          ? "text-[#021C57] border-b-2 border-[#021C57]"
                          : "text-gray-700"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Hamburger */}
              <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(true)}>
                  <Menu size={24} />
                </button>
              </div>
            </div>

            {isMenuOpen && (
              <div
                className="
                        fixed top-0 left-0 h-screen w-1/2 sm:w-1/2 bg-white shadow-lg z-50 p-4 flex flex-col gap-4"
              >
                {/* Close Button */}
                <div className="self-end">
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile Nav Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-gray-800 hover:text-blue-700 text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <button 
                onClick={() => console.log('Clicked')}
                className="button-style font-semibold px-4 py-2 flex items-center gap-2 transition rounded-md">
                  Request Quote <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </nav>

        </div>
      </header>

    </>
  );
};

export default Navbar;
