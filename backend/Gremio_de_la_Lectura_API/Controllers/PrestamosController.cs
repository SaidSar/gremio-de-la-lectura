using Gremio_de_la_Lectura_API.DB;
using Gremio_de_la_Lectura_API.Querys_base_datos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gremio_de_la_Lectura_API.Controllers {
    [Route("[controller]")]
    [ApiController]
    public class PrestamosController : ControllerBase {

        [HttpGet]
        [Route("Consultar")]
        public Prestamo Consultar(int Id) {
            Prestamo p = PrestamosDatos.Consultar(Id);
            return p;
        }

        [HttpGet]
        [Route("Listar")]
        public List<Prestamo> Listar(string? busqueda) {
            if(string.IsNullOrEmpty(busqueda)) {
                busqueda = "";
            }
            return PrestamosDatos.Listar(busqueda);
        }

        [HttpPost]
        [Route("Guardar")]
        public string Guardar(Prestamo l) {
            string id = PrestamosDatos.Registrar(l);
            return id;
        }

    
    }
}
