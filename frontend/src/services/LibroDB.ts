import api from "./api";
import { libro } from "./Libro";


export const ListarLibros = async() => {
    try{
        const {data} = await api.get<libro[]>("ClientesCT/Listar")
        return data;
    }catch{
        return null;
    }
}


export const GuardarLibro = async(l:libro) => {
    try{
        const {data} = await api.post<string>(
            "ClientesCT/Guardar", l
        );
        return data;
    }catch{
        return null;
    }

}
export const ConsultarCliente = async(id:number) => {
    try{
        const {data} = await api.get<libro>(`ClientesCT/Consultar?id=${id}`)
        return data;
    }catch{
        return null;
    }

}

