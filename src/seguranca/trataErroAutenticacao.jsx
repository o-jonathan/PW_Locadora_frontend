import { logout } from "./Autenticacao";

export function trataErroAutenticacao(err, navigate) {
    console.error(err);

    const mensagem = err?.message || "";

    if (
        mensagem.includes("Token expirado") ||
        mensagem.includes("401") ||
        mensagem.includes("403")
    ) {
        logout();
        navigate("/login", { replace: true });
        return true;
    }

    return false;
}