import { useState, useEffect } from 'react'

export default function StockLibros() {
  const [libros, setLibros] = useState([
    { codigo: '822fhk', titulo: 'El libro de la Selva', disponibilidad: 5,  enTotal: 8 },
    { codigo: '6482jd', titulo: 'El Padrino',           disponibilidad: 300, enTotal: 301 },
  ])

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/inventario/stock', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setLibros(data) })
      .catch(() => {})
  }, [])

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Inventario — Stock de libros</h2>
      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Disponibilidad</th>
              <th>En total</th>
            </tr>
          </thead>
          <tbody>
            {libros.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>Sin registros</td></tr>
            ) : libros.map(l => (
              <tr key={l.codigo}>
                <td>{l.codigo}</td>
                <td>{l.titulo}</td>
                <td>{l.disponibilidad}</td>
                <td>{l.enTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
