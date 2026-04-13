import api from "./api";
import { Cliente } from "./Tipos";

export const ListarClientes = async() => {
    try{
        const {data} = await api.get<Cliente[]>(`ClientesCT/Listar?indice=0`)
        return data;
    }catch{
        return null;
    }
}


export const GuardarCliente = async(c:Cliente) => {
    try{
        const {data} = await api.post<string>(
            "ClientesCT/Guardar", c
        );
        return data;
    }catch{
        return null;
    }

}
export const ConsultarCliente = async(id:number) => {
    try{
        const {data} = await api.get<Cliente>(`ClientesCT/Consultar?id=${id}`)
        return data;
    }catch{
        return null;
    }

}

