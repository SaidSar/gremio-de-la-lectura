using Microsoft.EntityFrameworkCore;
using GremioLectura.API.Models;

namespace GremioLectura.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Cliente>  Clientes  => Set<Cliente>();
    public DbSet<Libro>    Libros    => Set<Libro>();
    public DbSet<Prestamo> Prestamos => Set<Prestamo>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // Índices únicos
        mb.Entity<Cliente>().HasIndex(c => c.Codigo).IsUnique();
        mb.Entity<Libro>().HasIndex(l => l.Codigo).IsUnique();
        mb.Entity<Usuario>().HasIndex(u => u.NombreUsuario).IsUnique();

        // Relaciones
        mb.Entity<Prestamo>()
          .HasOne(p => p.Cliente)
          .WithMany(c => c.Prestamos)
          .HasForeignKey(p => p.ClienteId);

        mb.Entity<Prestamo>()
          .HasOne(p => p.Libro)
          .WithMany(l => l.Prestamos)
          .HasForeignKey(p => p.LibroId);
    }
}
