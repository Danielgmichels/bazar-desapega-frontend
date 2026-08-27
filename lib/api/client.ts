import axios from "axios";

export const api = axios.create({
    // Puxa a URL base do nosso .env.local
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    // Isso é OBRIGATÓRIO para o Laravel Sanctum funcionar. 
    // Permite que o front-end envie e receba cookies de autenticação do back-end.
    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Interceptador Global de Erros (Opcional, mas muito útil)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Sessão expirada ou usuário não autenticado.");
        }
        return Promise.reject(error);
    }
);