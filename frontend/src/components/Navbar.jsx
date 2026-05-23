import { Menu, X } from "lucide-react";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { Link, NavLink } from "react-router-dom";

import logo from "../assets/LOGO.png";

import { FaPhoneAlt } from "react-icons/fa";

import "../index.css";

import { useCategoryStore } from "../store/useCategoryStore.js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [query, setQuery] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchRef = useRef(null);

  const navLinks = [
    {
      name: "Home",
      to: "/",
    },

    {
      name: "About",
      to: "/about",
    },

    {
      name: "Laboratry Equipments",

      to: "/products",
    },

    {
      name: "Contact",
      to: "/contact",
    },
  ];

  const { categories = [], fetchCategories } = useCategoryStore();

  // FETCH CATEGORIES

  useEffect(() => {
    fetchCategories();
  }, []);

  // OUTSIDE CLICK

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // FILTERED CATEGORIES

  const filteredCategories = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    return categories.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, categories]);

  // SEARCH SUBMIT

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <header className="h-30 w-full">
        <div
          className="
        fixed
        top-0
        left-0
        right-0
        z-50
        h-30
        bg-white
      "
        >
          {/* TOP BAR */}

          <div
            className="
          upper-layer
          h-1/2
          flex
          justify-between
          items-center
          bg-zinc-100
          shadow-2xs
          px-5
        "
          >
            {/* SEARCH */}

            <div
              ref={searchRef}
              className="
            relative
            max-w-xs
            w-full
          "
            >
              <form
                onSubmit={handleSearch}
                className="
              relative
              rounded-md
              overflow-hidden
              bg-white
            "
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);

                    setIsSearchOpen(true);
                  }}
                  onFocus={() => {
                    if (query.trim()) {
                      setIsSearchOpen(true);
                    }
                  }}
                  placeholder="
                Search products...
              "
                  className="
                w-full
                pl-4
                pr-10
                py-2
                border
                rounded-md
                border-gray-300
                focus:outline
                focus:ring-2
                focus:ring-[#021C57]
                text-sm
              "
                />

                <button
                  type="submit"
                  className="
                button-style
                absolute
                right-0
                top-0
                bottom-0
                px-3
              "
                >
                  Search
                </button>
              </form>

              {/* SEARCH DROPDOWN */}

              {isSearchOpen && query.trim() !== "" && (
                <div
                  className="
                  absolute
                  top-full
                  left-0
                  right-0
                  mt-2
                  bg-white
                  rounded-xl
                  border
                  border-gray-200
                  shadow-xl
                  z-50
                  overflow-hidden
                  max-h-80
                  overflow-y-auto
                "
                >
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((item) => (
                      <Link
                        key={item._id}
                        to={`/categories/${item.slug}`}
                        onClick={() => {
                          setQuery("");

                          setIsSearchOpen(false);
                        }}
                        className="
                            block
                            px-4
                            py-3
                            text-sm
                            hover:bg-gray-50
                            transition
                            border-b
                            border-gray-100
                          "
                      >
                        {item.name}
                      </Link>
                    ))
                  ) : (
                    <div
                      className="
                          px-4
                          py-4
                          text-sm
                          text-gray-500
                        "
                    >
                      No category found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PHONE */}

            <div
              className="
            flex
            justify-center
            items-center
            gap-5
          "
            >
              <a
                className="
              text-[#021C57]
              md:block
              font-semibold
              hover:underline
              transition
            "
                href="
              tel:+918169695728
            "
              >
                <span className="hidden md:block">Call +91 8169695728</span>

                <FaPhoneAlt
                  className="
                md:hidden
                w-10
                h-10
                rounded-full
                hover:bg-[#021C57]
                transition
                border-2
                p-1.5
              "
                />
              </a>
            </div>
          </div>

          {/* NAVBAR */}

          <nav
            className="
          flex
          justify-between
          items-center
          h-1/2
          px-5
          py-3.5
          shadow-md
          shadow-black/50
          bg-white
        "
          >
            <div
              className="
            flex
            justify-between
            items-center
            w-full
          "
            >
              {/* LOGO */}

              <div className="logo-section">
                <Link
                  to="/"
                  className="
                flex
                items-center
                justify-center
                gap-2
              "
                >
                  <img
                    src={logo}
                    alt="logo"
                    className="
                  w-20
                  mix-blend-darken
                "
                  />

                  <div
                    className="
                  flex
                  flex-col
                  text-[#021C57]
                "
                  >
                    <p
                      className="
                    font-semibold
                    font-saira
                  "
                    >
                      ARCL INSTRUMENTS PVT. LTD
                    </p>

                    <p
                      className="
                    text-[8px]
                    md:text-[10px]
                    text-center
                  "
                    >
                      ( An ISO 9001:2025 Certified Company )
                    </p>
                  </div>
                </Link>
              </div>

              {/* DESKTOP MENU */}

              <div
                className="
              hidden
              lg:flex
              items-center
              gap-6
            "
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.to}
                    className={({ isActive }) =>
                      `
                      font-medium
                      px-2
                      py-1
                      transition-all

                      ${
                        isActive
                          ? "text-[#021C57] border-b-2 border-[#021C57]"
                          : "text-gray-700"
                      }
                    `
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* MOBILE MENU */}

              <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(true)}>
                  <Menu size={24} />
                </button>
              </div>
            </div>

            {/* MOBILE SIDEBAR */}

            {isMenuOpen && (
              <div
                className="
                fixed
                top-0
                left-0
                h-screen
                w-1/2
                sm:w-1/2
                bg-white
                shadow-lg
                z-50
                p-4
                flex
                flex-col
                gap-4
              "
              >
                {/* CLOSE */}

                <div className="self-end">
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                {/* MOBILE LINKS */}

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="
                      text-gray-800
                      hover:text-blue-700
                      text-sm
                      font-medium
                    "
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
