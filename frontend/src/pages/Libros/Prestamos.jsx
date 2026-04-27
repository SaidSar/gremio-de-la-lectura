import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListarLibros } from '../../services/LibroDB'
import { ConsultarCliente } from '../../services/ClienteDB'

export default function Prestamos() {
  const navigate = useNavigate()
  const [resultados, setResultados] = useState([])

  const [cliente, setCliente] = useState("")
  const [codigoCliente, setcodigoCliente] = useState('(nombre del cliente)')
  const [Titulo, setTitulo] = useState("")

  async function buscarlibro(e) {
    e.preventDefault()
    try {
      const data = await ListarLibros(Titulo, "T")
      if (data != null) {
        setResultados(data)
      }
    } catch {
    }
    console.log("libros ", resultados)
  }

  async function buscarcliente(e) {
    e.preventDefault()
    try {
      const data = await ConsultarCliente(codigoCliente)
      if (data != null) {
        setCliente(data.Nombrecompleto)
      }
    } catch {
    }
 console.log("cliente ", cliente)
  }

  async function prestar() {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ codigoCliente: form.codigoCliente, titulo }),
      })
    } catch { }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Libros — Préstamos</h2>

      <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

          <div className="campo">
            <label>Código del cliente:</label>
            <div>
              <input className="input" placeholder="(clave única del cliente)" value={codigoCliente}
                onChange={e => setcodigoCliente(e.target.value)} />
              <button type="submit" className="btn btn-primario" onClick={ buscarcliente}>🔍</button>
            </div>
          </div>

          <div className="campo">
            <label>Nombre del cliente:</label>
            <input className="input" value={cliente} readOnly style={{ background: '#f5f0e8' }} />
          </div>

          <div className="campo" style={{ position: 'relative' }}>
            <label>Título:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="(nombre del libro)"
                value={Titulo} onChange={e => setTitulo(e.target.value)} />
              <button type="submit" className="btn btn-primario" onClick={buscarlibro}>🔍</button>
            </div>
          </div>

        </form>
      </div>

      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Id</th>
              <th>Título</th>
              <th>Disponibilidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r, i) => (
              <tr key={i}>
                <td>{r.id}</td>
                <td>{r.titulo}</td>
                <td>{r.cantidad_disponible}</td>
                <td>
                  <button className="btn btn-primario" style={{ fontSize: 12 }}
                    onClick={() => prestar(r.titulo)} disabled={r.cantidad_disponible === 0}>
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
