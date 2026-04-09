import { useState } from 'react'
import './Catalogo.css'

const LIBROS_DEMO = [
  { id: 1, titulo: 'El libro de la Selva', autor: 'Rudyard Kipling', disponible: true },
  { id: 2, titulo: 'El Padrino', autor: 'Mario Puzo', disponible: true },
  { id: 3, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', disponible: false },
  { id: 4, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', disponible: true },
  { id: 5, titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', disponible: true },
]

export default function Catalogo() {
  const [busqueda, setBusqueda] = useState('')
  const [modalLibro, setModalLibro] = useState(null)
  const [prestado, setPrestado] = useState(null)

  const librosFiltrados = LIBROS_DEMO.filter(l =>
    l.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.autor.toLowerCase().includes(busqueda.toLowerCase())
  )

  function handlePrestar(libro) {
    setModalLibro(libro)
  }

  function confirmarPrestamo() {
    setPrestado(modalLibro.titulo)
    setModalLibro(null)
  }

  return (
    <div className="catalogo-page">

      {/* Buscador */}
      <div className="catalogo-buscador">
        <span className="buscador-icono">🔍</span>
        <input
          className="buscador-input"
          placeholder="Busca un libro"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Notificación préstamo exitoso */}
      {prestado && (
        <div className="catalogo-notif">
          ✅ Préstamo registrado: <strong>{prestado}</strong>
          <button onClick={() => setPrestado(null)}>✕</button>
        </div>
      )}

      {/* Lista de libros */}
      <div className="catalogo-lista">
        {librosFiltrados.length === 0 ? (
          <p className="catalogo-vacio">No se encontraron libros.</p>
        ) : librosFiltrados.map(libro => (
          <div key={libro.id} className="libro-item">
            <div className="libro-portada">📖</div>
            <div className="libro-info">
              <p className="libro-titulo">{libro.titulo}</p>
              <p className="libro-autor">{libro.autor}</p>
            </div>
            <div className="libro-acciones">
              <button
                className={`btn-prestar ${!libro.disponible ? 'no-disponible' : ''}`}
                onClick={() => libro.disponible && handlePrestar(libro)}
                title={libro.disponible ? 'Registrar préstamo' : 'No disponible'}
              >
                {libro.disponible ? '+' : '✕'}
              </button>
              <button className="btn-editar">✏️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal confirmar préstamo */}
      {modalLibro && (
        <div className="modal-overlay" onClick={() => setModalLibro(null)}>
          <div className="modal-card modal-salir" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📖</div>
            <h2>¿Registrar préstamo?</h2>
            <p className="modal-subtitulo"><strong>{modalLibro.titulo}</strong></p>
            <p className="modal-subtitulo">{modalLibro.autor}</p>
            <div className="modal-salir-botones">
              <button className="btn btn-secundario" onClick={() => setModalLibro(null)}>
                Cancelar
              </button>
              <button className="btn btn-primario" onClick={confirmarPrestamo}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}