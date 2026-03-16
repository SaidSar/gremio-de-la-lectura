namespace GremioLectura.API.Models;

// ── Usuario del sistema (empleados de la biblioteca) ──────────────────────
public class Usuario
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "Empleado"; // Empleado | Admin
}

// ── Cliente de la biblioteca ──────────────────────────────────────────────
public class Cliente
{
    public int Id { get; set; }
    public string Codigo { get; set; } = string.Empty;   // identificador único
    public string Nombre { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public DateTime FechaRegistro { get; set; } = DateTime.Now;

    // Navegación
    public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
}

// ── Libro ─────────────────────────────────────────────────────────────────
public class Libro
{
    public int Id { get; set; }
    public string Codigo { get; set; } = string.Empty;   // identificador único
    public string Titulo { get; set; } = string.Empty;
    public string Autor { get; set; } = string.Empty;
    public DateTime FechaAdquisicion { get; set; }
    public int StockTotal { get; set; }       // ejemplares totales
    public int Disponibles { get; set; }      // ejemplares sin prestar

    // Navegación
    public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
}

// ── Préstamo (entrada/salida de libros) ──────────────────────────────────
public class Prestamo
{
    public int Id { get; set; }

    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;

    public int LibroId { get; set; }
    public Libro Libro { get; set; } = null!;

    public DateTime FechaPrestamo { get; set; } = DateTime.Now;
    public DateTime? FechaDevolucion { get; set; }  // null = no devuelto aún
    public DateTime FechaLimite { get; set; }        // fecha máxima de entrega

    // Estado derivado: "No entregado" | "Entregado" | "Por entregar"
    public string Estado =>
        FechaDevolucion.HasValue ? "Entregado" :
        DateTime.Now > FechaLimite ? "No entregado" : "Por entregar";
}
