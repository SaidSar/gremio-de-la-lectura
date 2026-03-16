import { useState } from 'react'

export default function Prestamos() {
  const [form, setForm] = useState({ codigoCliente: '', titulo: '' })
  const [resultados, setResultados] = useState([
    { fecha: '3/06/2026',  titulo: 'El libro de la Selva', disponibilidad: 3 },
    { fecha: '5/06/2026',  titulo: 'El Padrino',           disponibilidad: 5 },
    { fecha: '06/06/2026', titulo: 'Ejemplo',              disponibilidad: 0 },
  ])
  const [nombreCliente, setNombreCliente] = useState('(nombre del cliente)')

  async function buscar(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/prestamos?codigoCliente=${form.codigoCliente}&titulo=${form.titulo}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setResultados(data.prestamos || [])
      setNombreCliente(data.nombreCliente || '')
    } catch {}
  }

  async function prestar(titulo) {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ codigoCliente: form.codigoCliente, titulo }),
      })
    } catch {}
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Libros — Préstamos</h2>

      <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
        <form onSubmit={buscar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="campo">
            <label>Código del cliente:</label>
            <input className="input" placeholder="(clave única del cliente)" value={form.codigoCliente}
              onChange={e => setForm({ ...form, codigoCliente: e.target.value })} />
          </div>
          <div className="campo">
            <label>Nombre del cliente:</label>
            <input className="input" value={nombreCliente} readOnly style={{ background: '#f5f0e8' }} />
          </div>
          <div className="campo" style={{ position: 'relative' }}>
            <label>Título:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="(nombre del libro)"
                value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
              <button type="submit" className="btn btn-primario">🔍</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha entregada / a entregar</th>
              <th>Título</th>
              <th>Disponibilidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r, i) => (
              <tr key={i}>
                <td>{r.fecha}</td>
                <td>{r.titulo}</td>
                <td>{r.disponibilidad}</td>
                <td>
                  <button className="btn btn-primario" style={{ fontSize: 12 }}
                    onClick={() => prestar(r.titulo)} disabled={r.disponibilidad === 0}>
                    Prestar
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
