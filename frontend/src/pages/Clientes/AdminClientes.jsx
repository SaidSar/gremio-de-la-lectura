import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConsultarCliente, ListarClientes } from '../../services/ClienteDB'


export default function AdminClientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [historial, setHistorial] = useState([])

  useEffect(() => {
    const d = async () => {
      setClientes([])
      const data = await ListarClientes();
      if (data != null) {
        setClientes(data)
      }
      else {
        setClientes([])
      }
      console.log(data)
    }
    d();
  }, [])

  function verHistorial(cliente) {
    setSeleccionado(cliente)
    const token = localStorage.getItem('token')
    fetch(`/api/clientes/${cliente.codigo}/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setHistorial)
      .catch(() => setHistorial([]))
  }

  const BADGE = { 'No entregado': 'badge-no-entregado', 'Entregado': 'badge-entregado', 'Por entregar': 'badge-pendiente' }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Clientes — Administración</h2>

      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Deudor</th>
              <th>Total Retardos</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>Sin registros</td></tr>
            ) : clientes.map(c => (
              <tr key={c.Id} onClick={() => verHistorial(c)} style={{ cursor: 'pointer' }}>
                <td>{c.nombrecompleto}</td>
                <td>{c.telefono}</td>
                <td>{c.correo}</td>
                <td>{c.direccion}</td>
                <td>{c.es_deudor == "True" ? "Deudor" : "Responsable"}</td>
                <td>{c.total_retardos}</td>
                <td>{c.fecha_registro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {seleccionado && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Historial de {seleccionado.Nombrecompleto}</h3>
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha entregada / a entregar</th>
                <th>Título</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>Sin historial</td></tr>
              ) : historial.map((h, i) => (
                <tr key={i}>
                  <td>{h.fecha}</td>
                  <td>{h.titulo}</td>
                  <td><span className={`badge ${BADGE[h.estado] || ''}`}>{h.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}