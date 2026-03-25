import logo from "../../../assets/LOGO.png";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <div className="bg-white shadow px-4 py-3 flex justify-between">
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
      <div>Profile</div>
    </div>
  );
};

export default Navbar;