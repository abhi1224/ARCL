import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/LOGO.png";
import { CiLinkedin } from "react-icons/ci";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { TbBrandLinkedin } from "react-icons/tb";
import { RiFacebookBoxLine } from "react-icons/ri";
import { FiYoutube } from "react-icons/fi";
import { FaSquareXTwitter, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Laboratry Equipments", to: "/products" },
    { name: "Scientfic Equipments", to: "/scientific-equipment" },
    { name: "Contact", to: "/contact" },
  ];
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* 1. Logo and Description */}
        <div>
              <div className="logo-section mb-5 bg-white p-1">
                <Link to="/" className='flex items-center gap-2'>
                  <img src= {logo} alt="logo" className="w-20 " />
                
                  <div className="flex flex-col text-[#021C57]">
                    <p className=" font-semibold font-saira">
                     ARCL INSTRUMENTS PVT. LTD
                    </p>
                    <p className="text-[8px] md:text-[10px] text-center">( An ISO 9001:2025 Certified Company )</p>
                  </div>
                </Link>
              </div>   
          <p className="text-gray-300 text-sm">
            ARCL is your trusted partner in industrial and laboratory equipment,
            offering innovative solutions and high-quality products to meet your
            needs.
          </p>
        </div>

        {/* 2. Useful Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `transition-all ${
                      isActive
                        ? "text-blue-700 border-b-2 border-blue-700"
                        : "text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Address */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Address</h3>
          <a href="https://maps.app.goo.gl/Xa2cZMx3Dg8yqrB49" className="text-gray-300 text-sm hover:text-blue-600 hover:underline" target="_blank">
            
            Arcl Instruments Private Limited <br />
            
            Shop No. 6, 
            <br />
            Siddivinayak Park CHS,
            <br />
            Sector - 8A Airoli,<br />
            Navi Mumbai - 400708
          </a>
        </div>

        {/* 4. Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>
              <a
                href="https://wa.me/918169695728?text=Hello%20I%20would%20like%20to%20inquire%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 hover:underline transition-all"
              >
                {" "}
                Whatsapp: +91 8169695728
              </a>
            </li>

            <li>
              <a
                href="mailto:arclinstruments@gmail.com"
                className="hover:text-blue-500 hover:underline transition-all"
              >
                Mail: arclinstruments@gmail.com
              </a>
            </li>
          </ul>

          <div className="flex justify-start items-center mt-10 gap-3">
            <a 
              className='hover:scale-110 transition-all'
              href="https://www.linkedin.com/company/arclinstruments/about/"  
              target="_blank"
              >
              <TbBrandLinkedin size={30}/>
            </a>
            <a 
              className='hover:scale-110 transition-all'
              href="https://www.instagram.com/arcl_lab/"  
              target="_blank"
              >
              <FaInstagram size={30}/>
            </a>

            <a 
              className='hover:scale-110 transition-all'
              href="https://www.facebook.com/people/ARCL-Instruments-Pvt-Ltd/61580266556551/?mibextid=wwXIfr&rdid=0pEWUbaSbugZ4VGO&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Jc3oq2HDm%2F%3Fmibextid%3DwwXIfr"  
              target="_blank"
              >
              <RiFacebookBoxLine size={30}/>
            </a>
            <a 
              className='hover:scale-110 transition-all'
              href="https://www.youtube.com/@ARCLLabSolutions"  
              target="_blank"
              >
              <FiYoutube size={30} />
            </a>
            <a 
              className='hover:scale-110 transition-all'
              href="https://x.com/ArclPrivate"  
              target="_blank"
              >
              <FaXTwitter  size={30}/>
            </a>
            
            

          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t-2 mt-10 text-gray-500 text-sm  py-5 ">
        <p className="text-center">
          &copy; {new Date().getFullYear()} ARCL. All rights reserved.
          <span> Designed and developed by </span>
        </p>
        <div className="text-center font-semibold">
          <a
            className="hover:underline mr-2"
            href="https://www.linkedin.com/in/harsh-mishra-4829a82aa/"
            target="_blank"
          >
            Harsh Mishra,
          </a>
          <a
            className="hover:underline"
            href="https://www.linkedin.com/in/abhi1224/"
            target="_blank"
          >    
            Abhishek Verma
          </a>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
