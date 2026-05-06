import { getFilmesAPI } from '../../services/filmeServices';
import { createContext, useEffect, useState } from "react";

export const FilmesContext = createContext();

export function FilmesProvider({ children }) {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFilmes();
    }, []);

    async function fetchFilmes() {
        try {
            setLoading(true);
            setError(null);
            const data = await getFilmesAPI();
            setFilmes(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Erro ao carregar filmes");
        } finally {
            setLoading(false);
        }
    }

    return (
        <FilmesContext.Provider value={{ filmes, setFilmes, loading, error, fetchFilmes }}>
            {children}
        </FilmesContext.Provider>
    );
}