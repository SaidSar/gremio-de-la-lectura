import { useState } from 'react'

export default function Disponibilidad() {
  const [form, setForm] = useState({ codigo: '', titulo: '' })
  const [libros, setLibros] = useState([
    { codigo: '822fhk', titulo: 'El libro de la Selva', disponibilidad: 5 },
    { codigo: '6482jd', titulo: 'El Padrino',           disponibilidad: 300 },
  ])

  async function buscar(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const params = new URLSearchParams(form).toString()
      const res = await fetch(`/api/libros/disponibilidad?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setLibros(Array.isArray(data) ? data : [])
    } catch {}
  }

  function limpiar() {
    setForm({ codigo: '', titulo: '' })
    setLibros([])
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Libros — Disponibilidad</h2>

      <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
        <form onSubmit={buscar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="campo">
            <label>Código:</label>
            <input className="input" placeholder="(clave única de libro)"
              value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} />
          </div>
          <div className="campo">
            <label>Título:</label>
            <input className="input" placeholder="(nombre del libro)"
              value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secundario" onClick={limpiar}>Limpiar</button>
            <button type="submit" className="btn btn-primario">🔍</button>
          </div>
        </form>
      </div>

      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            {libros.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>Sin resultados</td></tr>
            ) : libros.map(l => (
              <tr key={l.codigo}>
                <td>{l.codigo}</td>
                <td>{l.titulo}</td>
                <td>{l.disponibilidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
