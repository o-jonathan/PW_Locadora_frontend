const BASE = `${process.env.REACT_APP_ENDERECO_API}/filme`;
const JSON_HEADERS = { "Content-Type": "application/json" };

export const getFilmesAPI = async () => {
    const response = await fetch(BASE, {
        method: "GET",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const getFilmePorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "GET",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const deleteFilmePorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const postFilmeAPI = async (object) => {
    const response = await fetch(BASE, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(object),
    });
    return response.json();
};

export const putFilmeAPI = async (object) => {
    const response = await fetch(BASE, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(object),
    });
    return response.json();
};