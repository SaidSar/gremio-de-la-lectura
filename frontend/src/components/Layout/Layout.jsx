import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Layout.css'

const RUTAS = [
  { label: 'Menú Principal', path: '/menu' },
  { label: 'Clientes',       path: '/clientes/admin' },
  { label: 'Libros',         path: '/libros/prestamos' },
  { label: 'Inventario',     path: '/inventario/stock' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  function cerrarSesion() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="layout">
      {/* Barra superior */}
      <header className="navbar">
        <nav className="navbar-links">
          {RUTAS.map(r => (
            <button
              key={r.path}
              className={`navbar-btn ${location.pathname === r.path ? 'activo' : ''}`}
              onClick={() => navigate(r.path)}
            >
              {r.label}
            </button>
          ))}
        </nav>

        {/* Menú hamburguesa (≡) igual al mockup */}
        <div className="navbar-menu">
          <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
          {menuAbierto && (
            <div className="dropdown">
              <button onClick={cerrarSesion}>Salir</button>
              <button onClick={() => { navigate('/menu'); setMenuAbierto(false) }}>Acerca de nosotros</button>
            </div>
          )}
        </div>
      </header>

      {/* Contenido de la página */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
