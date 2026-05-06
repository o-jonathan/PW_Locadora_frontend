const BASE = `${process.env.REACT_APP_ENDERECO_API}/cliente`;
const JSON_HEADERS = { "Content-Type": "application/json" };

export const getClientesAPI = async () => {
    const response = await fetch(BASE, {
        method: "GET",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const getClientePorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "GET",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const deleteClientePorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const postClienteAPI = async (object) => {
    const response = await fetch(BASE, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(object),
    });
    return response.json();
};

export const putClienteAPI = async (object) => {
    const response = await fetch(BASE, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(object),
    });
    return response.json();
};