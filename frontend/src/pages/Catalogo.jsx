import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrestamos } from '../services/PrestamosContext'
import './Catalogo.css'

const PESTANAS = ['Libros', 'Comics', 'Manga']

const QUERIES_INICIALES = {
  Libros:  '',
  Comics:  'subject:comics',
  Manga:   'subject:manga',
}

async function buscarGutenberg(query) {
  const url = query.trim()
    ? `https://gutendex.com/books?search=${encodeURIComponent(query)}`
    : `https://gutendex.com/books`
  const res = await fetch(url)
  const data = await res.json()
  return (data.results || []).map(libro => ({
    id: String(libro.id),
    titulo: libro.title || 'Sin título',
    autor: libro.authors?.map(a => a.name).join(', ') || 'Autor desconocido',
    portada: libro.formats?.['image/jpeg'] || null,
    previewLink: libro.formats?.['text/html'] || libro.formats?.['application/epub+zip'] || null,
  }))
}

async function buscarOpenLibrary(query) {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
  )
  const data = await res.json()
  return (data.docs || []).map(item => ({
    id: item.key,
    titulo: item.title || 'Sin título',
    autor: item.author_name?.join(', ') || 'Autor desconocido',
    portada: item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : null,
    previewLink: item.key ? `https://openlibrary.org${item.key}` : null,
  }))
}

export default function Catalogo() {
  const navigate = useNavigate()
  const { agregarPrestamo } = usePrestamos()
  const [pestanaActiva, setPestanaActiva] = useState('Libros')
  const [busqueda, setBusqueda] = useState('')
  const [libros, setLibros] = useState([])
  const [cargando, setCargando] = useState(false)
  const [modalLibro, setModalLibro] = useState(null)
  const [notif, setNotif] = useState(null)

  // Carga al cambiar de pestaña
  useEffect(() => {
    setBusqueda('')
    cargarContenido(pestanaActiva, '')
  }, [pestanaActiva])

  // Debounce al escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarContenido(pestanaActiva, busqueda)
    }, 500)
    return () => clearTimeout(timer)
  }, [busqueda])

  async function cargarContenido(pestana, query) {
    setCargando(true)
    try {
      let resultado = []
      if (pestana === 'Libros') {
        resultado = await buscarGutenberg(query)
      } else {
        const q = query.trim()
          ? `${query} ${pestana === 'Comics' ? 'comics' : 'manga'}`
          : QUERIES_INICIALES[pestana]
        resultado = await buscarOpenLibrary(q)
      }
      setLibros(resultado)
    } catch {
      setLibros([])
    } finally {
      setCargando(false)
    }
  }

  function handlePrestar(libro) {
    setModalLibro(libro)
  }

  function confirmarPrestamo() {
    agregarPrestamo(modalLibro)
    setNotif(`"${modalLibro.titulo}" agregado a tus préstamos.`)
    setModalLibro(null)
    setTimeout(() => setNotif(null), 3000)
  }

  function abrirLectura(previewLink) {
    if (previewLink) window.open(previewLink, '_blank')
  }

  return (
    <div className="catalogo-page">

      {/* Pestañas */}
      <div className="catalogo-pestanas">
        {PESTANAS.map(p => (
          <button
            key={p}
            className={`pestana-btn ${pestanaActiva === p ? 'activa' : ''}`}
            onClick={() => setPestanaActiva(p)}
          >
            {p === 'Libros' ? '📚' : p === 'Comics' ? '🦸' : '🎌'} {p}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="catalogo-buscador">
        <span className="buscador-icono">🔍</span>
        <input
          className="buscador-input"
          placeholder={`Busca ${pestanaActiva.toLowerCase()}...`}
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-texto-suave)', fontSize: 16 }}
          >✕</button>
        )}
      </div>

      {/* Botón mis préstamos */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-acento" onClick={() => navigate('/mis-prestamos')}>
          📋 Mis préstamos
        </button>
      </div>

      {/* Notificación */}
      {notif && (
        <div className="catalogo-notif">
          ✅ {notif}
          <button onClick={() => setNotif(null)}>✕</button>
        </div>
      )}

      {/* Cargando */}
      {cargando && (
        <p style={{ textAlign: 'center', color: 'var(--color-texto-suave)', padding: 20 }}>
          Cargando {pestanaActiva.toLowerCase()}...
        </p>
      )}

      {/* Lista */}
      {!cargando && (
        <div className="catalogo-lista">
          {libros.length === 0 ? (
            <p className="catalogo-vacio">No se encontraron resultados.</p>
          ) : libros.map(libro => (
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
              <div className="libro-acciones">
                <button
                  className="btn-editar"
                  onClick={() => abrirLectura(libro.previewLink)}
                  title="Leer"
                  style={{ opacity: libro.previewLink ? 1 : 0.4 }}
                >
                  👁️
                </button>
                <button
                  className="btn-prestar"
                  onClick={() => handlePrestar(libro)}
                  title="Agregar préstamo"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalLibro && (
        <div className="modal-overlay" onClick={() => setModalLibro(null)}>
          <div className="modal-card modal-salir" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📖</div>
            <h2>¿Registrar préstamo?</h2>
            <p className="modal-subtitulo"><strong>{modalLibro.titulo}</strong></p>
            <p className="modal-subtitulo">{modalLibro.autor}</p>
            <div className="modal-salir-botones">
              <button className="btn btn-secundario" onClick={() => setModalLibro(null)}>Cancelar</button>
              <button className="btn btn-primario" onClick={confirmarPrestamo}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}