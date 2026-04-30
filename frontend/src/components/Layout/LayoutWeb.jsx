import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/GremioLogo.jpeg'
import './Layout.css'
import './LayoutWeb.css'

export default function LayoutWeb({ children }) {
  const navigate = useNavigate()
  const [modalSalir, setModalSalir] = useState(false)
  const [modalInfo, setModalInfo] = useState(false)

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('usuarioId')
    navigate('/')
  }

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-logo" onClick={() => navigate('/catalogo')}>
          <img src={logo} alt="Logo" style={{ height: 36, borderRadius: 4, cursor: 'pointer' }} />
          <span className="navbar-nombre">El Gremio de la Lectura</span>
        </div>

        <div className="navbar-menu">
          <button className="hamburger" onClick={() => setModalInfo(true)} title="Información">ℹ️</button>
          <button className="hamburger" onClick={() => setModalSalir(true)} title="Salir">☰</button>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      {/* Modal Salir */}
      {modalSalir && (
        <div className="modal-overlay" onClick={() => setModalSalir(false)}>
          <div className="modal-card modal-salir" onClick={e => e.stopPropagation()}>
            <div className="login-escudo"  ><img style={{ maxWidth: '130px', width: '100%', height: 'auto' }} src={logo}/> </div>
            <h2>¿Cerrar sesión?</h2>
            <p className="modal-subtitulo">Se cerrará tu sesión y regresarás al inicio.</p>
            <div className="modal-salir-botones">
              <button className="btn btn-secundario" onClick={() => setModalSalir(false)}>Cancelar</button>
              <button className="btn btn-peligro" onClick={cerrarSesion}>Sí, salir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Acerca de nosotros para usuarios web */}
      {modalInfo && (
        <div className="modal-overlay" onClick={() => setModalInfo(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setModalInfo(false)}>✕</button>
            <img src={logo} alt="Logo" style={{ width: 100, height: 'auto', marginBottom: 8 }} />
            <h2>El Gremio de la Lectura</h2>
            <p className="modal-subtitulo">Biblioteca física y digital</p>

            <div className="modal-seccion">
              <h3>📍 Encuéntranos</h3>
              <p>Av. Ejemplo 123, Col. Centro, Los Mochis, Sinaloa, México.</p>
              <p style={{ marginTop: 6, fontSize: 12, color: 'var(--color-texto-suave)' }}>
                Lunes a Viernes: 8:00 AM – 6:00 PM | Sábado: 9:00 AM – 2:00 PM
              </p>
            </div>

            <div className="modal-seccion">
              <h3>🗺️ Ubicación</h3>
              <div style={{ borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                <iframe
                  title="Ubicación biblioteca"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.5!2d-108.9874!3d25.7906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ3JzI2LjIiTiAxMDjCsDU5JzE0LjYiVw!5e0!3m2!1ses!2smx!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>

            <div className="modal-seccion">
              <h3>📞 Contacto</h3>
              <p>Tel: 668 XXX XXXX</p>
              <p>Email: contacto@gremiodelalectura.mx</p>
            </div>

            <div className="modal-seccion">
              <h3>🌐 Redes sociales</h3>
              <p style={{ color: 'var(--color-texto-suave)', fontSize: 13 }}>
                Próximamente en Instagram y Facebook.
              </p>
            </div>

            <p className="modal-version">El Gremio de la Lectura © 2026</p>
          </div>
        </div>
      )}
    </div>
  )
}