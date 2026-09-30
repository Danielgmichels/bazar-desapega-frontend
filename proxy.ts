import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const token =
        request.cookies.get("bazar_token")?.value ||
        request.cookies.get("bazar_auth")?.value;

    const hasSession = Boolean(token);

    const userCookie = request.cookies.get("bazar_user")?.value;
    let isAdmin = false;

    if (userCookie) {
        try {
            const parsedUser = JSON.parse(decodeURIComponent(userCookie));
            isAdmin = Boolean(
                parsedUser.is_admin === true ||
                parsedUser.is_admin === 1 ||
                parsedUser.is_admin === "1"
            );
        } catch {
            isAdmin = false;
        }
    }

    const isAdminLoginRoute = path === "/admin/login";
    const isAdminRoute = path.startsWith("/admin");
    const isClientRoute = path.startsWith("/minha-conta");
    const isCheckoutRoute = path.startsWith("/checkout") && !path.startsWith("/checkout/sucesso");
    const isPublicAuthRoute = path === "/login" || path === "/cadastro";

    // 1. Rota de Login do Administrador (/admin/login)
    if (isAdminLoginRoute) {
        if (hasSession && isAdmin) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.next();
    }

    // 2. Rotas Administrativas restritas (/admin/*)
    if (isAdminRoute) {
        if (!hasSession) {
            return NextResponse.redirect(
                new URL(`/admin/login?redirect=${encodeURIComponent(path)}`, request.url)
            );
        }

        if (!isAdmin) {
            return NextResponse.redirect(
                new URL("/admin/login?error=unauthorized", request.url)
            );
        }

        return NextResponse.next();
    }

    // 3. Rotas de Cliente (/minha-conta/*, /checkout)
    if ((isClientRoute || isCheckoutRoute) && !hasSession) {
        return NextResponse.redirect(
            new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url)
        );
    }

    // 4. Rotas de autenticação pública (/login, /cadastro)
    if (isPublicAuthRoute && hasSession) {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/minha-conta/:path*",
        "/checkout",
        "/login",
        "/cadastro",
    ],
};