using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GremioLectura.API.Data;
using GremioLectura.API.DTOs;
using GremioLectura.API.Models;

namespace GremioLectura.API.Controllers;

[ApiController]
[Authorize]
public class LibrosController : ControllerBase
{
    private readonly AppDbContext _db;
    public LibrosController(AppDbContext db) => _db = db;

    // ── Alta de libro ─────────────────────────────────────────────────────
    [HttpPost("api/libros")]
    public async Task<IActionResult> Alta([FromBody] LibroRequest req)
    {
        if (!DateTime.TryParse(req.Fecha, out var fecha))
            return BadRequest("Fecha inválida.");

        var libro = new Libro
        {
            Codigo           = GenerarCodigo(),
            Titulo           = req.Titulo,
            Autor            = req.Autor,
            FechaAdquisicion = fecha,
            StockTotal       = 1,
            Disponibles      = 1,
        };
        _db.Libros.Add(libro);
        await _db.SaveChangesAsync();
        return Ok(new { libro.Codigo });
    }

    // ── Disponibilidad ────────────────────────────────────────────────────
    [HttpGet("api/libros/disponibilidad")]
    public async Task<IActionResult> Disponibilidad(string? codigo, string? titulo)
    {
        var q = _db.Libros.AsQueryable();
        if (!string.IsNullOrEmpty(codigo)) q = q.Where(l => l.Codigo.Contains(codigo));
        if (!string.IsNullOrEmpty(titulo))  q = q.Where(l => l.Titulo.Contains(titulo));

        var lista = await q.Select(l => new LibroResponse(l.Codigo, l.Titulo, l.Disponibles)).ToListAsync();
        return Ok(lista);
    }

    // ── Stock (inventario) ────────────────────────────────────────────────
    [HttpGet("api/inventario/stock")]
    public async Task<IActionResult> Stock()
    {
        var lista = await _db.Libros
            .Select(l => new StockResponse(l.Codigo, l.Titulo, l.Disponibles, l.StockTotal))
            .ToListAsync();
        return Ok(lista);
    }

    // ── Préstamos ─────────────────────────────────────────────────────────
    [HttpGet("api/prestamos")]
    public async Task<IActionResult> GetPrestamos(string? codigoCliente, string? titulo)
    {
        var cliente = await _db.Clientes
            .Include(c => c.Prestamos).ThenInclude(p => p.Libro)
            .FirstOrDefaultAsync(c => c.Codigo == codigoCliente);

        if (cliente is null) return NotFound();

        var q = cliente.Prestamos.AsEnumerable();
        if (!string.IsNullOrEmpty(titulo))
            q = q.Where(p => p.Libro.Titulo.Contains(titulo, StringComparison.OrdinalIgnoreCase));

        var prestamos = q.Select(p => new PrestamoResponse(
            p.FechaLimite.ToString("d/MM/yyyy"),
            p.Libro.Titulo,
            p.Libro.Disponibles
        )).ToList();

        return Ok(new PrestamosBusquedaResponse(cliente.Nombre, prestamos));
    }

    [HttpPost("api/prestamos")]
    public async Task<IActionResult> Prestar([FromBody] PrestamoRequest req)
    {
        var cliente = await _db.Clientes.FirstOrDefaultAsync(c => c.Codigo == req.CodigoCliente);
        if (cliente is null) return NotFound("Cliente no encontrado.");

        var libro = await _db.Libros.FirstOrDefaultAsync(l => l.Titulo == req.Titulo);
        if (libro is null) return NotFound("Libro no encontrado.");
        if (libro.Disponibles <= 0) return BadRequest("Sin ejemplares disponibles.");

        libro.Disponibles--;
        var prestamo = new Prestamo
        {
            ClienteId   = cliente.Id,
            LibroId     = libro.Id,
            FechaLimite = DateTime.Now.AddDays(15),
        };
        _db.Prestamos.Add(prestamo);
        await _db.SaveChangesAsync();
        return Ok();
    }

    // ── Devoluciones ──────────────────────────────────────────────────────
    [HttpGet("api/devoluciones")]
    public async Task<IActionResult> GetDevoluciones(string? codigoCliente)
    {
        var cliente = await _db.Clientes
            .Include(c => c.Prestamos).ThenInclude(p => p.Libro)
            .FirstOrDefaultAsync(c => c.Codigo == codigoCliente);

        if (cliente is null) return NotFound();

        var historial = cliente.Prestamos.Select(p => new HistorialItem(
            p.FechaLimite.ToString("d/MM/yyyy"),
            p.Libro.Titulo,
            p.Estado
        )).ToList();

        return Ok(new DevolucionBusquedaResponse(cliente.Nombre, historial));
    }

    [HttpPost("api/devoluciones")]
    public async Task<IActionResult> Devolver([FromBody] DevolucionRequest req)
    {
        var prestamo = await _db.Prestamos
            .Include(p => p.Cliente)
            .Include(p => p.Libro)
            .FirstOrDefaultAsync(p =>
                p.Cliente.Codigo == req.CodigoCliente &&
                p.Libro.Titulo   == req.Titulo &&
                p.FechaDevolucion == null);

        if (prestamo is null) return NotFound("Préstamo activo no encontrado.");

        prestamo.FechaDevolucion = DateTime.Now;
        prestamo.Libro.Disponibles++;
        await _db.SaveChangesAsync();
        return Ok();
    }

    private static string GenerarCodigo()
    {
        const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var rand = new Random();
        return new string(Enumerable.Range(0, 6).Select(_ => chars[rand.Next(chars.Length)]).ToArray());
    }
}
