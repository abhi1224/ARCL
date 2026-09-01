import React from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import QuoteCartDrawer from './components/quoteCart/QuoteCartDrawer'
import FloatingQuoteCartButton from './components/quoteCart/FloatingQuoteCartButton'

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <QuoteCartDrawer />
      <FloatingQuoteCartButton />
    </>
  )
}

export default App
