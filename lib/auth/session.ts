import { User } from "@/contracts/auth";

const TOKEN_KEY = "bazar_token";
const USER_KEY = "bazar_user";
const AUTH_KEY = "bazar_auth";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
}

function setCookie(name: string, value: string, days: number = 7) {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function saveAuthSession(token: string, user: User) {
    setCookie(TOKEN_KEY, token);
    setCookie(USER_KEY, encodeURIComponent(JSON.stringify(user)));
    setCookie(AUTH_KEY, "1");

    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            localStorage.setItem(AUTH_KEY, "1");
        } catch {
            // LocalStorage fallback
        }
    }
}


export function setStoredUser(user: User) {
    setCookie(USER_KEY, encodeURIComponent(JSON.stringify(user)));

    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch {
            // LocalStorage fallback
        }
    }
}


export function getAuthToken(): string | null {
    const cookieToken = getCookie(TOKEN_KEY);
    if (cookieToken) return cookieToken;

    if (typeof window !== "undefined") {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
    }
    return null;
}

export function getAuthUser(): User | null {
    const cookieUser = getCookie(USER_KEY);
    if (cookieUser) {
        try {
            return JSON.parse(decodeURIComponent(cookieUser));
        } catch {
            // ignore
        }
    }

    if (typeof window !== "undefined") {
        try {
            const localUser = localStorage.getItem(USER_KEY);
            return localUser ? JSON.parse(localUser) : null;
        } catch {
            return null;
        }
    }
    return null;
}

export function clearAuthSession() {
    removeCookie(TOKEN_KEY);
    removeCookie(USER_KEY);
    removeCookie(AUTH_KEY);

    if (typeof window !== "undefined") {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(AUTH_KEY);
        } catch {
            // ignore
        }
    }
}


