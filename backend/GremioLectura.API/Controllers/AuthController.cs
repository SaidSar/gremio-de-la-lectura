using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GremioLectura.API.Data;
using GremioLectura.API.DTOs;

namespace GremioLectura.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var usuario = await _db.Usuarios
            .FirstOrDefaultAsync(u => u.NombreUsuario == req.Usuario);

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(req.Contrasena, usuario.PasswordHash))
            return Unauthorized(new { mensaje = "Credenciales incorrectas." });

        var token = GenerarToken(usuario.NombreUsuario, usuario.Rol);
        return Ok(new LoginResponse(token));
    }

    private string GenerarToken(string usuario, string rol)
    {
        var key  = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var horas = int.Parse(_config["Jwt:ExpireHours"] ?? "8");

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario),
            new Claim(ClaimTypes.Role, rol),
        };

        var jwt = new JwtSecurityToken(
            issuer:   _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims:   claims,
            expires:  DateTime.UtcNow.AddHours(horas),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}
