using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GremioLectura.API.Data;
using GremioLectura.API.DTOs;
using GremioLectura.API.Models;

namespace GremioLectura.API.Controllers;

[ApiController]
[Route("api/clientes")]
[Authorize]
public class ClientesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ClientesController(AppDbContext db) => _db = db;

    // GET /api/clientes
    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var lista = await _db.Clientes
            .Select(c => new ClienteResponse(
                c.Codigo, c.Nombre, c.Telefono, c.Correo, c.Direccion,
                c.FechaRegistro.ToString("dd/MM/yyyy")))
            .ToListAsync();
        return Ok(lista);
    }

    // POST /api/clientes
    [HttpPost]
    public async Task<IActionResult> Alta([FromBody] ClienteRequest req)
    {
        var codigo = GenerarCodigo();
        var cliente = new Cliente
        {
            Codigo   = codigo,
            Nombre   = req.Nombre,
            Telefono = req.Telefono,
            Correo   = req.Correo,
            Direccion = req.Direccion,
        };
        _db.Clientes.Add(cliente);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetHistorial), new { codigo }, new { codigo });
    }

    // GET /api/clientes/{codigo}/historial
    [HttpGet("{codigo}/historial")]
    public async Task<IActionResult> GetHistorial(string codigo)
    {
        var cliente = await _db.Clientes
            .Include(c => c.Prestamos).ThenInclude(p => p.Libro)
            .FirstOrDefaultAsync(c => c.Codigo == codigo);

        if (cliente is null) return NotFound();

        var historial = cliente.Prestamos.Select(p => new HistorialItem(
            p.FechaLimite.ToString("d/MM/yyyy"),
            p.Libro.Titulo,
            p.Estado
        )).ToList();

        return Ok(historial);
    }

    // Genera un código único alfanumérico de 6 caracteres
    private static string GenerarCodigo()
    {
        const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var rand = new Random();
        return new string(Enumerable.Range(0, 6).Select(_ => chars[rand.Next(chars.Length)]).ToArray());
    }
}
