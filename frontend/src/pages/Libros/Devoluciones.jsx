import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const BADGE = {
  'Activo':        'badge-no-entregado',
  'Por entregar':  'badge-pendiente',
  'No entregado':  'badge-no-entregado',
  'Devuelto':      'badge-entregado',
  'Entregado':     'badge-entregado',
  'Vencido':       'badge-no-entregado',
}
export default function Devoluciones() {
  const navigate = useNavigate()
  const [codigoCliente, setCodigoCliente] = useState('')
  const [cliente, setCliente] = useState(null)
  const [prestamos, setPrestamos] = useState([])
  const [mensaje, setMensaje] = useState(null)

  async function buscarCliente(e) {
    e.preventDefault()
    try {
      const { data } = await api.get(`ClientesCT/ConsultarPorCodigo?codigo=${codigoCliente}`)
      if (data.id === 0) {
        setCliente(null)
        setPrestamos([])
        setMensaje({ tipo: 'error', texto: 'Cliente no encontrado.' })
        return
      }
      setCliente(data)
      setMensaje(null)
      const res = await api.get(`Prestamos/ListarPorCliente?idCliente=${data.id}`)
      setPrestamos(res.data || [])
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al buscar cliente.' })
    }
  }

  async function devolver(idPrestamo) {
    try {
      const { data } = await api.post(`Prestamos/Devolver?idPrestamo=${idPrestamo}`)
      if (data.startsWith('Error')) {
        setMensaje({ tipo: 'error', texto: data })
      } else {
        setMensaje({ tipo: 'exito', texto: data })
        // Recargar préstamos
        const res = await api.get(`Prestamos/ListarPorCliente?idCliente=${cliente.id}`)
        setPrestamos(res.data || [])
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al registrar devolución.' })
    }
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Libros — Devoluciones</h2>

      <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
        <form onSubmit={buscarCliente} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="campo">
            <label>Código del cliente:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Ej: E57104F5"
                value={codigoCliente} onChange={e => setCodigoCliente(e.target.value)} />
              <button type="submit" className="btn btn-primario">🔍</button>
            </div>
          </div>
          <div className="campo">
            <label>Nombre del cliente:</label>
            <input className="input" value={cliente ? cliente.nombrecompleto : ''}
              readOnly style={{ background: '#f5f0e8' }} />
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
              <th>Id</th>
              <th>Fecha préstamo</th>
              <th>Fecha límite</th>
              <th>Fecha devolución</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prestamos.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>
                {cliente ? 'Sin préstamos activos' : 'Busca un cliente para ver sus préstamos'}
              </td></tr>
            ) : prestamos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.fechaPrestamo}</td>
                <td>{p.fechaLimite}</td>
                <td>{p.fechaDevolucion || '—'}</td>
                <td><span className={`badge ${BADGE[p.estado] || ''}`}>{p.estado}</span></td>
                <td>
                  {(p.estado === 'Activo' || p.estado === 'Por entregar' || p.estado === 'No entregado') && (
                    <button className="btn btn-acento" style={{ fontSize: 12 }}
                      onClick={() => devolver(p.id)}>
                      Devolver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}