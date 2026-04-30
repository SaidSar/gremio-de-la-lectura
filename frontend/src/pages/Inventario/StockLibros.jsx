import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListarLibros } from '../../services/LibroDB'

export default function StockLibros() {
  const navigate = useNavigate()
  const [libros, setLibros] = useState([])

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await ListarLibros('', 'T')
        if (data) setLibros(data)
      } catch {}
    }
    cargar()
  }, [])

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Inventario — Stock de libros</h2>
      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Id</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Categoría</th>
              <th>Disponibles</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {libros.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>Sin registros</td></tr>
            ) : libros.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.titulo}</td>
                <td>{l.autor}</td>
                <td>{l.categoria}</td>
                <td>{l.cantidad_disponible}</td>
                <td>{l.cantidad_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}