import { getToken } from "../seguranca/Autenticacao";
const BASE = `${process.env.REACT_APP_ENDERECO_API}/filme`;

export const getFilmesAPI = async () => {
    const response = await fetch(BASE, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        }
    });
    return response.json();
};

export const getFilmePorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        }
    });
    return response.json();
};

export const deleteFilmePorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        }
    });
    return response.json();
};

export const postFilmeAPI = async (object) => {
    const response = await fetch(BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        },
        body: JSON.stringify(object),
    });
    return response.json();
};

export const putFilmeAPI = async (object) => {
    const response = await fetch(BASE, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        },
        body: JSON.stringify(object),
    });
    return response.json();
};