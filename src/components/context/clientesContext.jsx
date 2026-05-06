import { getClientesAPI } from '../../services/clienteServices';
import { createContext, useEffect, useState } from "react";

export const ClientesContext = createContext();

export function ClientesProvider({ children }) {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    async function fetchClientes() {
        try {
            setLoading(true);
            setError(null);
            const data = await getClientesAPI();
            setClientes(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Erro ao carregar clientes");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ClientesContext.Provider value={{ clientes, setClientes, loading, error, fetchClientes }}>
            {children}
        </ClientesContext.Provider>
    );
}