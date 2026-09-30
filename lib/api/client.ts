import axios, { AxiosError } from "axios";
import { getAuthToken, clearAuthSession } from "@/lib/auth/session";
import { FrontendApiError } from "@/contracts/auth";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export const apiClient = api;


// Interceptor de Requisição: Injeta automaticamente o Bearer Token do Sanctum se existir
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de Resposta: Normaliza erros de API e trata 401
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
        if (error.response?.status === 401) {
            console.warn("Sessão expirada ou usuário não autenticado.");
            // Não limpamos em rotas públicas como login para permitir exibir mensagem de credenciais inválidas
            if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                clearAuthSession();
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Utilitário para extrair mensagem amigável e erros de validação da API Laravel
 */
export function parseApiError(error: unknown): FrontendApiError {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;

        if (status === 422 && data?.errors) {
            const firstErrorMessage = Object.values(data.errors)[0]?.[0] || data.message || "Erro de validação dos dados informados.";
            return {
                status,
                message: firstErrorMessage,
                fieldErrors: data.errors,
            };
        }

        if (status === 401) {
            return {
                status,
                message: data?.message || "E-mail ou senha incorretos.",
            };
        }

        if (status === 403) {
            return {
                status,
                message: data?.message || "Você não tem permissão para realizar esta ação.",
            };
        }

        if (status === 404) {
            return {
                status,
                message: data?.message || "Recurso não encontrado.",
            };
        }

        if (data?.message) {
            return {
                status,
                message: data.message,
                fieldErrors: data.errors,
            };
        }

        if (error.code === "ECONNABORTED" || error.message.includes("Network Error")) {
            return {
                status: 0,
                message: "Não foi possível conectar ao servidor. Verifique se o back-end está rodando.",
            };
        }
    }

    return {
        message: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
    };
}