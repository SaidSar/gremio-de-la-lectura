import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListarLibros } from '../../services/LibroDB'

export default function Disponibilidad() {
  const navigate = useNavigate()
  const [libros, setLibros] = useState([])
  const [Titulo, setTitulo] = useState("")
  const [Codigo, setCodigo] = useState("")

  async function buscar(e) {
    e.preventDefault()
    var tipo = ''
     var busqueda = ""
    if (Codigo == "") {
      busqueda = Titulo
      tipo = 'T'
    }
    else {
      busqueda = Codigo
      tipo = 'C'
    }
    try {
      const data = await ListarLibros(busqueda, tipo)
      if (data != null) {
        setLibros(data)
      }
    } catch {
    }

  }

  function limpiar() {
    setCodigo("")
    setTitulo("")
    setLibros([])
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Libros — Disponibilidad</h2>

      <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
        <form onSubmit={buscar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="campo">
            <label>Código:</label>
            <input className="input" placeholder="(clave única de libro)"
              value={Codigo} onChange={e => setCodigo(e.target.value)} />
          </div>
          <div className="campo">
            <label>Título:</label>
            <input className="input" placeholder="(nombre del libro)"
              value={Titulo} onChange={e => setTitulo(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secundario" onClick={limpiar}>Limpiar</button>
            <button type="submit" className="btn btn-primario" onClick={buscar} >🔍</button>
          </div>
        </form>
      </div>

      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Id</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            {libros.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>Sin resultados</td></tr>
            ) : libros.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.titulo}</td>
                <td>{l.autor}</td>
                <td>{l.cantidad_disponible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}