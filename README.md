# 📚 El Gremio de la Lectura

Sistema de administración de biblioteca desarrollado por **Nexus Code™**.

## Equipo de desarrollo

| Rol | Nombre | Responsabilidad |
|-----|--------|----------------|
| Product Manager | Carlos Ponce | Diseño visual del sistema |
| Arquitecto de Software | Said Sarmiento | Arquitectura del proyecto |
| Desarrollador | Jesus Cervantes | Login / Acceso al sistema |
| Desarrollador | Lucio Adrián | Ventana principal del sistema |

## Stack tecnológico

- **Frontend:** React (JavaScript) + Vite
- **Backend:** ASP.NET Core Web API (.NET 8)
- **Base de datos:** SQL Server
- **Control de versiones:** GitHub

## Estructura del repositorio

```
gremio-de-la-lectura/
├── frontend/          # Aplicación React
│   └── src/
│       ├── components/    # Componentes reutilizables
│       ├── pages/         # Páginas/vistas principales
│       ├── services/      # Llamadas a la API
│       └── styles/        # Estilos globales
├── backend/           # API REST en .NET 8
│   └── GremioLectura.API/
│       ├── Controllers/   # Endpoints
│       ├── Models/        # Entidades
│       ├── DTOs/          # Objetos de transferencia
│       └── Data/          # Contexto de BD
└── .github/
    └── workflows/     # CI/CD (opcional)
```

## Módulos del sistema

```
Login
 └── Menú Principal
      ├── Clientes
      │    ├── Alta de clientes
      │    └── Administración de clientes
      ├── Libros
      │    ├── Préstamos
      │    ├── Devoluciones
      │    └── Disponibilidad
      └── Inventario
           ├── Stock de libros
           └── Alta de libros
```

## Cómo iniciar

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend/GremioLectura.API
dotnet restore
dotnet run
```

## Cliente
- **Nombre:** Jack Gepete
- **Contacto:** JackGepete96@Gmail.com | 668 196 5012
- **Empresa:** Nexus Code™
