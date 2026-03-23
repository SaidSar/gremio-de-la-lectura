namespace GremioLectura.API.Models;

// ── Usuario del sistema (empleados de la biblioteca) ──────────────────────
public class Usuario
{
    public int Id { get; set; }
    public string usuario { get; set; } = string.Empty;
    public string contraseña { get; set; } = string.Empty;
    public string Rol { get; set; } = "Empleado"; // Empleado | Admin
    public string  fecha_creacion { get; set; }
}

// ── Cliente de la biblioteca ──────────────────────────────────────────────
public class Cliente
{
    public int Id { get; set; }
    public string Nombrecompleto { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string es_deudor { get; set; } = string.Empty;
    public string total_retardos { get; set; } = DateTime.Now;
    public string fecha_registro { get; set; }

    public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
}

// ── Libro ─────────────────────────────────────────────────────────────────
public class Libro
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Autor { get; set; } = string.Empty;
    public string editorial { get; set; }
    public int año { get; set; }       // ejemplares totales
    public string categoria { get; set; }      // ejemplares sin prestar
    public string isbn { get; set; }


}




public class Prestamo
{
    public int Id { get; set; }

    public int Id_cliente { get; set; }
    public int Id_usuario { get; set; }


    public string FechaPrestamo { get; set; } = DateTime.Now;
    public string FechaDevolucion { get; set; }  // null = no devuelto aún
    public string FechaLimite { get; set; }        // fecha máxima de entrega

    // Estado derivado: "No entregado" | "Entregado" | "Por entregar"
    public string Estado =>
        FechaDevolucion.HasValue ? "Entregado" :
        DateTime.Now > FechaLimite ? "No entregado" : "Por entregar";
}

public class DetallePrestamo{
    public int Id { get; set; }
    public int Id_prestamo { get; set; }
    public int Id_usuario { get; set; }
    public int cantidad { get; set; }
    
}