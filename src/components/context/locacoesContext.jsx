import { getLocacoesAPI } from '../../services/locacaoServices';
import { getItensLocacoesAPI } from '../../services/itemLocacaoServices';
import { createContext, useEffect, useState } from "react";

export const LocacoesContext = createContext();

export function LocacoesProvider({ children }) {
    const [locacoes, setLocacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLocacoes();
    }, []);

    async function fetchLocacoes() {
        try {
            setLoading(true);
            setError(null);

            // Busca locações e itens em paralelo
            const [locacoesData, itensData] = await Promise.all([
                getLocacoesAPI(),
                getItensLocacoesAPI(),
            ]);

            // Embute os itens dentro de cada locação
            const locacoesComItens = locacoesData.map(l => ({
                ...l,
                itemLocacoes: itensData.filter(i => i.locacao_id === l.id),
            }));

            setLocacoes(locacoesComItens);
        } catch (err) {
            console.error(err);
            setError(err.message || "Erro ao carregar locações");
        } finally {
            setLoading(false);
        }
    }

    return (
        <LocacoesContext.Provider value={{ locacoes, setLocacoes, loading, error, fetchLocacoes }}>
            {children}
        </LocacoesContext.Provider>
    );
}