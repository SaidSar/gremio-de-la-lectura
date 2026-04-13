import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BADGE = {
  'No entregado': 'badge-no-entregado',
  'Entregado':    'badge-entregado',
  'Por entregar': 'badge-pendiente',
}

export default function Devoluciones() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ codigoCliente: '', nombreCliente: '' })
  const [historial, setHistorial] = useState([
    { fecha: '',  titulo: '', estado: '' }
  ])

  async function buscar(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/devoluciones?codigoCliente=${form.codigoCliente}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setHistorial(data.historial || [])
      setForm(f => ({ ...f, nombreCliente: data.nombreCliente || '' }))
    } catch {}
  }

  async function entregar(titulo) {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/devoluciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ codigoCliente: form.codigoCliente, titulo }),
      })
      setHistorial(h => h.map(i => i.titulo === titulo ? { ...i, estado: 'Entregado' } : i))
    } catch {}
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Libros — Devoluciones</h2>

      <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
        <form onSubmit={buscar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="campo">
            <label>Código del cliente:</label>
            <input className="input" placeholder="(clave única del cliente)"
              value={form.codigoCliente}
              onChange={e => setForm({ ...form, codigoCliente: e.target.value })} />
          </div>
          <div className="campo">
            <label>Nombre del cliente:</label>
            <input className="input" value={form.nombreCliente} readOnly style={{ background: '#f5f0e8' }} />
          </div>
          <button type="submit" className="btn btn-primario" style={{ alignSelf: 'flex-end' }}>Buscar</button>
        </form>
      </div>

      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha entregada / a entregar</th>
              <th>Título</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {historial.map((h, i) => (
              <tr key={i}>
                <td>{h.fecha}</td>
                <td>{h.titulo}</td>
                <td><span className={`badge ${BADGE[h.estado] || ''}`}>{h.estado}</span></td>
                <td>
                  {h.estado !== 'Entregado' && (
                    <button className="btn btn-acento" style={{ fontSize: 12 }}
                      onClick={() => entregar(h.titulo)}>
                      Entregar
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