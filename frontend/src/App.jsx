import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Menu from './pages/Menu.jsx'
import Layout from './components/Layout/Layout.jsx'

// Clientes
import AltaClientes from './pages/Clientes/AltaClientes.jsx'
import AdminClientes from './pages/Clientes/AdminClientes.jsx'

// Libros
import Prestamos from './pages/Libros/Prestamos.jsx'
import Devoluciones from './pages/Libros/Devoluciones.jsx'
import Disponibilidad from './pages/Libros/Disponibilidad.jsx'
import AltaLibros from './pages/Libros/AltaLibros.jsx'

// Inventario
import StockLibros from './pages/Inventario/StockLibros.jsx'

// Guard simple: si no hay token, redirige al login
function RutaProtegida({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/" element={<Login />} />

      {/* Protegidas */}
      <Route path="/menu" element={
        <RutaProtegida><Layout><Menu /></Layout></RutaProtegida>
      } />
      <Route path="/clientes/alta" element={
        <RutaProtegida><Layout><AltaClientes /></Layout></RutaProtegida>
      } />
      <Route path="/clientes/admin" element={
        <RutaProtegida><Layout><AdminClientes /></Layout></RutaProtegida>
      } />
      <Route path="/libros/prestamos" element={
        <RutaProtegida><Layout><Prestamos /></Layout></RutaProtegida>
      } />
      <Route path="/libros/devoluciones" element={
        <RutaProtegida><Layout><Devoluciones /></Layout></RutaProtegida>
      } />
      <Route path="/libros/disponibilidad" element={
        <RutaProtegida><Layout><Disponibilidad /></Layout></RutaProtegida>
      } />
      <Route path="/libros/alta" element={
        <RutaProtegida><Layout><AltaLibros /></Layout></RutaProtegida>
      } />
      <Route path="/inventario/stock" element={
        <RutaProtegida><Layout><StockLibros /></Layout></RutaProtegida>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
