import { getToken } from "../seguranca/Autenticacao";
const BASE = `${process.env.REACT_APP_ENDERECO_API}/cliente`;

export const getClientesAPI = async () => {
    const response = await fetch(BASE, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        }
    });
    return response.json();
};

export const getClientePorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        }
    });
    return response.json();
};

export const deleteClientePorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        }
    });
    return response.json();
};

export const postClienteAPI = async (object) => {
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

export const putClienteAPI = async (object) => {
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