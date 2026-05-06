const BASE = `${process.env.REACT_APP_ENDERECO_API}/itemlocacao`;
const JSON_HEADERS = { "Content-Type": "application/json" };

export const getItensLocacoesAPI = async () => {
    const response = await fetch(BASE, {
        method: "GET",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const getItemLocacaoPorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "GET",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const deleteItemLocacaoPorIdAPI = async (id) => {
    const response = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: JSON_HEADERS,
    });
    return response.json();
};

export const postItemLocacaoAPI = async (object) => {
    const response = await fetch(BASE, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(object),
    });
    return response.json();
};

export const putItemLocacaoAPI = async (object) => {
    const response = await fetch(BASE, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(object),
    });
    return response.json();
};