import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListarLibros } from '../../services/LibroDB'
import api from '../../services/api'

export default function Prestamos() {
  const navigate = useNavigate()
  const [resultados, setResultados] = useState([])
  const [cliente, setCliente] = useState(null)
  const [codigoCliente, setCodigoCliente] = useState('')
  const [Titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function buscarCliente(e) {
    e.preventDefault()
    try {
      const { data } = await api.get(`ClientesCT/ConsultarPorCodigo?codigo=${codigoCliente}`)
      if (data.id === 0) {
        setCliente(null)
        setMensaje({ tipo: 'error', texto: 'Cliente no encontrado.' })
      } else {
        setCliente(data)
        setMensaje(null)
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al buscar cliente.' })
    }
  }

  async function buscarLibro(e) {
    e.preventDefault()
    try {
      const data = await ListarLibros(Titulo, 'T')
      if (data) setResultados(data)
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al buscar libros.' })
    }
  }

  async function prestar(idLibro) {
    if (!cliente) {
      setMensaje({ tipo: 'error', texto: 'Primero busca un cliente.' })
      return
    }
    setCargando(true)
    try {
      const usuarioId = 1 // temporal hasta tener sesión completa
      const { data } = await api.post(
        `Prestamos/Registrar?idCliente=${cliente.id}&idUsuario=${usuarioId}&idLibro=${idLibro}`
      )
      if (data.startsWith('Error')) {
        setMensaje({ tipo: 'error', texto: data })
      } else {
        setMensaje({ tipo: 'exito', texto: data })
        // Actualizar disponibilidad en la lista
        const nuevaData = await ListarLibros(Titulo, 'T')
        if (nuevaData) setResultados(nuevaData)
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al registrar préstamo.' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Libros — Préstamos</h2>

      <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Buscar cliente */}
          <div className="campo">
            <label>Código del cliente:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Ej: E57104F5"
                value={codigoCliente} onChange={e => setCodigoCliente(e.target.value)} />
              <button type="button" className="btn btn-primario" onClick={buscarCliente}>🔍</button>
            </div>
          </div>

          <div className="campo">
            <label>Nombre del cliente:</label>
            <input className="input" value={cliente ? cliente.nombrecompleto : ''}
              readOnly style={{ background: '#f5f0e8' }} />
          </div>

          {/* Buscar libro */}
          <div className="campo">
            <label>Título del libro:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Buscar por título"
                value={Titulo} onChange={e => setTitulo(e.target.value)} />
              <button type="button" className="btn btn-primario" onClick={buscarLibro}>🔍</button>
            </div>
          </div>

        </form>
      </div>

      {mensaje && (
        <div style={{
          padding: '8px 12px', borderRadius: 'var(--radio)', fontSize: 13, marginBottom: 16,
          background: mensaje.tipo === 'exito' ? '#C8E6C9' : '#FFCDD2',
          color: mensaje.tipo === 'exito' ? '#2E7D32' : '#B71C1C',
        }}>
          {mensaje.texto}
        </div>
      )}

      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Disponibilidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resultados.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>
                Busca un libro para comenzar
              </td></tr>
            ) : resultados.map(r => (
              <tr key={r.id}>
                <td>{r.titulo}</td>
                <td>{r.autor}</td>
                <td>{r.cantidad_disponible}</td>
                <td>
                  <button
                    className="btn btn-primario"
                    style={{ fontSize: 12 }}
                    onClick={() => prestar(r.id)}
                    disabled={r.cantidad_disponible === 0 || cargando}
                  >
                    {r.cantidad_disponible === 0 ? 'Sin stock' : 'Prestar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}