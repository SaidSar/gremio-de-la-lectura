import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Layout.css'
import logo from '../assets/GremioLogo.jpeg'

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
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalSalir, setModalSalir] = useState(false)

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
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

        <div className="navbar-menu">
          <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
          {menuAbierto && (
            <div className="dropdown">
              <button onClick={() => { setModalSalir(true); setMenuAbierto(false) }}>
                Salir
              </button>
              <button onClick={() => { setModalAbierto(true); setMenuAbierto(false) }}>
                Acerca de nosotros
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenido de la página */}
      <main className="main-content">
        {children}
      </main>

      {/* Modal Confirmar salida */}
      {modalSalir && (
        <div className="modal-overlay" onClick={() => setModalSalir(false)}>
          <div className="modal-card modal-salir" onClick={e => e.stopPropagation()}>
            <div className="login-escudo"  ><img style={{ maxWidth: '130px', width: '100%', height: 'auto' }} src={logo}/> </div>
            <h2>¿Cerrar sesión?</h2>
            <p className="modal-subtitulo">Se cerrará tu sesión actual y regresarás al inicio.</p>
            <div className="modal-salir-botones">
              <button className="btn btn-secundario" onClick={() => setModalSalir(false)}>
                Cancelar
              </button>
              <button className="btn btn-peligro" onClick={cerrarSesion}>
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Acerca de nosotros */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setModalAbierto(false)}>✕</button>
            <div className="login-escudo"  ><img style={{ maxWidth: '130px', width: '100%', height: 'auto' }} src={logo}/> </div>
            <h2>El Gremio de la Lectura</h2>
            <p className="modal-subtitulo">Sistema de Gestión Bibliotecaria</p>

            <div className="modal-seccion">
              <h3>¿Qué es este sistema?</h3>
              <p>
                Plataforma web desarrollada para administrar de manera eficiente
                los recursos de la biblioteca: control de préstamos, devoluciones,
                inventario de libros y registro de clientes.
              </p>
            </div>

            <div className="modal-seccion">
              <h3>¿Qué puedes hacer aquí?</h3>
              <ul>
                <li>📖 Registrar préstamos y devoluciones de libros</li>
                <li>👥 Dar de alta y administrar clientes</li>
                <li>📦 Consultar el inventario y stock de libros</li>
                <li>🔍 Ver disponibilidad de ejemplares en tiempo real</li>
              </ul>
            </div>

            <div className="modal-seccion">
              <h3>Desarrollado por</h3>
              <p><strong>Nexus Code™</strong> — Digital Creations</p>
              <p className="modal-equipo">
                Carlos Ponce · Said Sarmiento · Jesus Cervantes · Lucio Adrián
              </p>
            </div>

            <p className="modal-version">v1.0.0 — 2026</p>
          </div>
        </div>
      )}
    </div>
  )
}