import { useNavigate } from 'react-router-dom'
import './Menu.css'

const MODULOS = [
  {
    titulo: 'Clientes',
    icono: '👥',
    opciones: [
      { label: 'Alta de clientes',         path: '/clientes/alta' },
      { label: 'Administración de clientes', path: '/clientes/admin' },
    ],
  },
  
  {
    titulo: 'Libros',
    icono: '📖',
    opciones: [
      { label: 'Préstamos',      path: '/libros/prestamos' },
      { label: 'Devoluciones',   path: '/libros/devoluciones' },
      { label: 'Disponibilidad', path: '/libros/disponibilidad' },
      { label: 'Alta de libros', path: '/libros/alta' },
    ],
  },

  {
    titulo: 'Inventario',
    icono: '📦',
    opciones: [
      { label: 'Stock de libros', path: '/inventario/stock' },
      { label: 'Alta de libros',  path: '/libros/alta' },
    ],
  },
  
]

export default function Menu() {
  const navigate = useNavigate()

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="login-escudo"  ><img style={{ maxWidth: '130px', width: '100%', height: 'auto' }} src='../../assets/GremioLogo.jpeg'/> </div>
        <h1>El Gremio de la Lectura</h1>
        <p>Selecciona un módulo para comenzar</p>
      </div>

      <div className="menu-grid">
        {MODULOS.map(mod => (
          <div key={mod.titulo} className="card modulo-card">
            <div className="modulo-titulo">
              <span className="modulo-icono">{mod.icono}</span>
              <h2>{mod.titulo}</h2>
            </div>
            <div className="modulo-opciones">
              {mod.opciones.map(op => (
                <button
                  key={op.path}
                  className="btn btn-secundario modulo-btn"
                  onClick={() => navigate(op.path)}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
