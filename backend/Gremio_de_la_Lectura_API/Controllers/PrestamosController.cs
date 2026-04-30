using Gremio_de_la_Lectura_API.Querys_base_datos;
using Microsoft.AspNetCore.Mvc;

namespace Gremio_de_la_Lectura_API.Controllers {
    [Route("[controller]")]
    [ApiController]
    public class PrestamosController : ControllerBase {

        [HttpGet]
        [Route("Consultar")]
        public Prestamo Consultar(int Id) {
            return PrestamosDatos.Consultar(Id);
        }

        [HttpGet]
        [Route("ListarPorCliente")]
        public List<Prestamo> ListarPorCliente(int idCliente) {
            return PrestamosDatos.ListarPorCliente(idCliente);
        }

        [HttpPost]
        [Route("Registrar")]
        public string Registrar(int idCliente, int idUsuario, int idLibro) {
            return PrestamosDatos.Registrar(idCliente, idUsuario, idLibro);
        }

        [HttpPost]
        [Route("Devolver")]
        public string Devolver(int idPrestamo) {
            return PrestamosDatos.Devolver(idPrestamo);
        }
    }
}