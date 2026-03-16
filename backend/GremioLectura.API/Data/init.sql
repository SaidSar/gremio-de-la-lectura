-- ============================================================
--  El Gremio de la Lectura — Script de base de datos inicial
--  SQL Server
-- ============================================================

CREATE DATABASE GremioLectura;
GO
USE GremioLectura;
GO

-- ── Usuarios del sistema ─────────────────────────────────────────────────
CREATE TABLE Usuarios (
    Id            INT IDENTITY PRIMARY KEY,
    NombreUsuario NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash  NVARCHAR(255) NOT NULL,
    Rol           NVARCHAR(50)  NOT NULL DEFAULT 'Empleado'
);

-- ── Clientes ─────────────────────────────────────────────────────────────
CREATE TABLE Clientes (
    Id            INT IDENTITY PRIMARY KEY,
    Codigo        NVARCHAR(10)  NOT NULL UNIQUE,
    Nombre        NVARCHAR(150) NOT NULL,
    Telefono      NVARCHAR(20),
    Correo        NVARCHAR(150),
    Direccion     NVARCHAR(250),
    FechaRegistro DATETIME      NOT NULL DEFAULT GETDATE()
);

-- ── Libros ───────────────────────────────────────────────────────────────
CREATE TABLE Libros (
    Id               INT IDENTITY PRIMARY KEY,
    Codigo           NVARCHAR(10)  NOT NULL UNIQUE,
    Titulo           NVARCHAR(250) NOT NULL,
    Autor            NVARCHAR(150),
    FechaAdquisicion DATE,
    StockTotal       INT NOT NULL DEFAULT 1,
    Disponibles      INT NOT NULL DEFAULT 1
);

-- ── Préstamos ────────────────────────────────────────────────────────────
CREATE TABLE Prestamos (
    Id               INT IDENTITY PRIMARY KEY,
    ClienteId        INT NOT NULL REFERENCES Clientes(Id),
    LibroId          INT NOT NULL REFERENCES Libros(Id),
    FechaPrestamo    DATETIME NOT NULL DEFAULT GETDATE(),
    FechaLimite      DATETIME NOT NULL,
    FechaDevolucion  DATETIME NULL   -- NULL = no devuelto aún
);
GO

-- ── Usuario administrador inicial ─────────────────────────────────────────
-- Contraseña: admin123  (hash BCrypt generado — cámbiala en producción)
INSERT INTO Usuarios (NombreUsuario, PasswordHash, Rol)
VALUES ('admin', '$2a$11$exampleHashReplaceWithRealBCrypt', 'Admin');
GO
