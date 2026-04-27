import { useNavigate } from 'react-router-dom'
import { usePrestamos } from '../services/PrestamosContext'

export default function MisPrestamos() {
  const navigate = useNavigate()
  const { librosPrestados, cancelarPrestamo } = usePrestamos()

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <button className="btn-regresar" onClick={() => navigate('/catalogo')}>← Catálogo</button>
      <h2 style={{ marginBottom: 20 }}>📋 Mis préstamos</h2>

      {librosPrestados.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--color-texto-suave)' }}>
          No tienes préstamos registrados aún.
        </div>
      ) : (
        <div className="catalogo-lista">
          {librosPrestados.map(libro => (
            <div key={libro.id} className="libro-item">
              <div className="libro-portada">
                {libro.portada
                  ? <img src={libro.portada} alt={libro.titulo} style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                  : '📖'
                }
              </div>
              <div className="libro-info">
                <p className="libro-titulo">{libro.titulo}</p>
                <p className="libro-autor">{libro.autor}</p>
              </div>
              <button
                className="btn btn-peligro"
                style={{ fontSize: 12 }}
                onClick={() => cancelarPrestamo(libro.id)}
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}