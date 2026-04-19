import { createContext, useContext, useState, useEffect } from 'react'

const PrestamosContext = createContext()

export function PrestamosProvider({ children }) {
  const [librosPrestados, setLibrosPrestados] = useState(() => {
    try {
      const guardados = localStorage.getItem('librosPrestados')
      return guardados ? JSON.parse(guardados) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('librosPrestados', JSON.stringify(librosPrestados))
  }, [librosPrestados])

  function agregarPrestamo(libro) {
    setLibrosPrestados(prev => {
      if (prev.find(l => l.id === libro.id)) return prev
      return [...prev, libro]
    })
  }

  function cancelarPrestamo(id) {
    setLibrosPrestados(prev => prev.filter(l => l.id !== id))
  }

  return (
    <PrestamosContext.Provider value={{ librosPrestados, agregarPrestamo, cancelarPrestamo }}>
      {children}
    </PrestamosContext.Provider>
  )
}

export function usePrestamos() {
  return useContext(PrestamosContext)
}