namespace GremioLectura.API.DTOs;

// ── Auth ──────────────────────────────────────────────────────────────────
public record LoginRequest(string Usuario, string Contrasena);
public record LoginResponse(string Token);

// ── Clientes ─────────────────────────────────────────────────────────────
public record ClienteRequest(
    string Nombre,
    string Telefono,
    string Correo,
    string Direccion
);

public record ClienteResponse(
    string Codigo,
    string Nombre,
    string Telefono,
    string Correo,
    string Direccion,
    string FechaRegistro
);

public record HistorialItem(
    string Fecha,
    string Titulo,
    string Estado
);

// ── Libros ────────────────────────────────────────────────────────────────
public record LibroRequest(
    string Titulo,
    string Autor,
    string Fecha
);

public record LibroResponse(
    string Codigo,
    string Titulo,
    int Disponibilidad
);

public record StockResponse(
    string Codigo,
    string Titulo,
    int Disponibilidad,
    int EnTotal
);

// ── Préstamos ─────────────────────────────────────────────────────────────
public record PrestamoRequest(string CodigoCliente, string Titulo);

public record PrestamoResponse(
    string Fecha,
    string Titulo,
    int Disponibilidad
);

public record PrestamosBusquedaResponse(
    string NombreCliente,
    List<PrestamoResponse> Prestamos
);

// ── Devoluciones ─────────────────────────────────────────────────────────
public record DevolucionRequest(string CodigoCliente, string Titulo);

public record DevolucionBusquedaResponse(
    string NombreCliente,
    List<HistorialItem> Historial
);
