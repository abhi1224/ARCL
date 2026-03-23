import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-white' : 'text-gray-300 transition hover:text-white'

  return (
    <header className="w-full bg-gray-900 px-6 py-4 text-white shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-xl font-semibold tracking-wide">ARCL</h1>
        <div className="flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
