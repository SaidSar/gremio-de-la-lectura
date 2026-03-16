import { useState } from 'react'

const FORM_INICIAL = { nombre: '', telefono: '', correo: '', direccion: '' }

export default function AltaClientes() {
  const [form, setForm] = useState(FORM_INICIAL)
  const [mensaje, setMensaje] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function limpiar() {
    setForm(FORM_INICIAL)
    setMensaje(null)
  }

  async function guardar(e) {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setMensaje({ tipo: 'exito', texto: 'Cliente registrado correctamente.' })
      limpiar()
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al guardar el cliente.' })
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Clientes — Alta</h2>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {[
            { label: 'Nombre:', name: 'nombre', placeholder: '(nombre del cliente)' },
            { label: 'Número telefónico:', name: 'telefono', placeholder: '(número del cliente)' },
            { label: 'Correo Electrónico:', name: 'correo', placeholder: '(correo del cliente)', type: 'email' },
            { label: 'Dirección:', name: 'direccion', placeholder: '(dirección del cliente)' },
          ].map(f => (
            <div key={f.name} className="campo">
              <label>{f.label}</label>
              <input
                className="input"
                name={f.name}
                type={f.type || 'text'}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {mensaje && (
            <p style={{
              padding: '8px 12px',
              borderRadius: 'var(--radio)',
              background: mensaje.tipo === 'exito' ? '#C8E6C9' : '#FFCDD2',
              color: mensaje.tipo === 'exito' ? '#2E7D32' : '#B71C1C',
              fontSize: 13,
            }}>
              {mensaje.texto}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secundario" onClick={limpiar}>Limpiar</button>
            <button type="submit" className="btn btn-acento">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
