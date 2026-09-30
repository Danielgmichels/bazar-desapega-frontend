export interface User {
    id: number | string;
    name: string;
    email: string;
    is_admin: boolean | number;
    telefone?: string;
    data_nascimento?: string;
    cidade?: string;
    endereco?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    message?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name?: string;
    nome?: string;
    email: string;
    password: string;
    password_confirmation?: string;
    id_cidade?: number | string;
    cidade?: string;
    data_nascimento?: string | null;
    telefone?: string | null;
    endereco?: string | null;
}


export interface FrontendApiError {
    status?: number;
    message: string;
    fieldErrors?: Record<string, string[]>;
}

