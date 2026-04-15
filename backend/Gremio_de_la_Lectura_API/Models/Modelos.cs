
// ── Usuario del sistema (empleados de la biblioteca) ──────────────────────
using System.Globalization;

public class Usuario
{
    public int Id { get; set; }
    public string usuario { get; set; } = string.Empty;
    public string contrasena { get; set; } = string.Empty;
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
    public string Direccion { get; set; } = string.Empty;
    public string es_deudor { get; set; } = string.Empty;
    public string total_retardos { get; set; } = string.Empty;
    public string fecha_registro { get; set; } = DateTime.Now.ToString("dd/MM/yyyy");

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


    public string FechaPrestamo { get; set; } = DateTime.Now.ToString("dd/MM/yyyy");
    public string FechaDevolucion { get; set; }  // null = no devuelto aún
    public string FechaLimite { get; set; }

    //Estado derivado: "No entregado" | "Entregado" | "Por entregar"
    public string Estado {
        get {
            if(!string.IsNullOrEmpty(FechaDevolucion))
                return "Entregado";

            DateTime fechaLimiteConvertida = DateTime.ParseExact(
                FechaLimite,
                "dd/MM/yyyy",
                CultureInfo.InvariantCulture
            );

            return DateTime.Now > fechaLimiteConvertida
                ? "No entregado"
                : "Por entregar";
        }
    }
}

public class DetallePrestamo{
    public int Id { get; set; }
    public int Id_prestamo { get; set; }
    public int Id_usuario { get; set; }
    public int cantidad { get; set; }
    
}