import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function StockLibros() {
  const navigate = useNavigate()
  const [libros, setLibros] = useState([
    { codigo: '', titulo: '', disponibilidad: 0, enTotal: 0 }
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
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
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