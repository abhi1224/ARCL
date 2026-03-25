import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Layout from './components/admin/layout/Layout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import EquipmentTypeList from './pages/admin/EquipmentTypeList.jsx'
import CategoryList from './pages/admin/CategoryList.jsx'
import ProductList from './pages/admin/ProductList.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Website Layout */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Panel Layout */}
        <Route path='/admin' element={true ? <Layout /> : <h1>Login</h1>}>
          <Route index element = {<Dashboard />}/>
          <Route path='equipment-types' element = {<EquipmentTypeList />}/>
          <Route path='categories' element = {<CategoryList />}/>
          <Route path='products' element = {<ProductList />}/>

        </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
