"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginPayload, RegisterPayload } from "@/contracts/auth";
import { saveAuthSession, getAuthToken, getAuthUser, clearAuthSession } from "@/lib/auth/session";
import { api, parseApiError } from "@/lib/api/client";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (credentials: LoginPayload) => Promise<{ success: boolean; user?: User; error?: string }>;
    register: (payload: RegisterPayload) => Promise<{ success: boolean; user?: User; error?: string; fieldErrors?: Record<string, string[]> }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = getAuthToken();
        const savedUser = getAuthUser();

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginPayload) => {
        try {
            const response = await api.post("/api/login", credentials);
            const data = response.data;

            const authToken = data.token || data.access_token;
            const rawUser = data.user || data.data?.user || data;
            const authUser: User = {
                id: rawUser.id_usuario ?? rawUser.id,
                name: rawUser.nome ?? rawUser.name ?? "Cliente",
                email: rawUser.email,
                is_admin: Boolean(rawUser.is_admin),
                telefone: rawUser.telefone,
                data_nascimento: rawUser.data_nascimento,
                cidade: rawUser.cidade?.nome ?? rawUser.cidade,
                endereco: rawUser.endereco,
            };

            if (!authToken) {
                throw new Error("Token de autenticação não retornado pela API.");
            }

            saveAuthSession(authToken, authUser);
            setToken(authToken);
            setUser(authUser);

            return { success: true, user: authUser };
        } catch (error) {
            const parsed = parseApiError(error);
            return { success: false, error: parsed.message };
        }
    };

    const registerUser = async (payload: RegisterPayload) => {
        try {
            // Garante o envio de campos esperados tanto por convenções camelCase/English quanto snake_case/Português da API Laravel
            const apiPayload = {
                ...payload,
                nome: payload.nome || payload.name,
                name: payload.nome || payload.name,
                id_cidade: payload.id_cidade,
                data_nascimento: payload.data_nascimento || null,
                telefone: payload.telefone || null,
                endereco: payload.endereco || null,
            };

            const response = await api.post("/api/register", apiPayload);
            const data = response.data;

            const authToken = data.token || data.access_token;
            const rawUser = data.user || data.data?.user || data;
            const authUser: User = {
                id: rawUser.id_usuario ?? rawUser.id,
                name: rawUser.nome ?? rawUser.name ?? payload.nome ?? payload.name ?? "Cliente",
                email: rawUser.email ?? payload.email,
                is_admin: false,
                telefone: rawUser.telefone ?? payload.telefone ?? undefined,
                data_nascimento: rawUser.data_nascimento ?? payload.data_nascimento ?? undefined,
                cidade: rawUser.cidade?.nome ?? rawUser.cidade ?? payload.cidade ?? undefined,
                endereco: rawUser.endereco ?? payload.endereco ?? undefined,
            };

            if (authToken) {
                saveAuthSession(authToken, authUser);
                setToken(authToken);
                setUser(authUser);
            }

            return { success: true, user: authUser };
        } catch (error) {
            const parsed = parseApiError(error);
            return {
                success: false,
                error: parsed.message,
                fieldErrors: parsed.fieldErrors,
            };
        }
    };


    const logout = () => {
        // Tenta informar o backend para revogar o token (se a rota existir)
        api.post("/api/logout").catch(() => {
            // Ignora se rota ainda não estiver implementada
        });

        clearAuthSession();
        setToken(null);
        setUser(null);

        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    };

    const isAdmin = Boolean(user && (user.is_admin === true || user.is_admin === 1 || user.is_admin === 1));

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: Boolean(token && user),
                isAdmin,
                isLoading,
                login,
                register: registerUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
    }
    return context;
}

