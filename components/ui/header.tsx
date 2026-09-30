"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, User, Search, Menu, X, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";

export function Header() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { count } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--line)] bg-[var(--background)]/90 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Mobile: Menu Hamburguer e Logo */}
                <div className="flex items-center gap-4 lg:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-[var(--foreground)]"
                        aria-label="Alternar menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <Link href="/" className="text-xl font-medium tracking-tight">
                        bazar <span className="font-light text-[var(--muted)]">desapega</span>
                    </Link>
                </div>

                {/* Desktop: Logo e Navegação Principal */}
                <div className="hidden lg:flex lg:items-center lg:gap-8">
                    <Link href="/" className="text-2xl font-medium tracking-tight hover:opacity-80 transition-opacity">
                        bazar desapega
                    </Link>
                    <nav className="flex gap-6">
                        <Link
                            href="/produtos"
                            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                            Produtos
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
                            >
                                <Shield className="h-3.5 w-3.5" />
                                Painel Admin
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Ações Globais: Busca, Conta e Cesta */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <Link
                        href="/produtos"
                        className="text-[var(--foreground)] hover:text-[var(--muted)] transition-colors"
                        title="Buscar produtos"
                    >
                        <Search className="h-5 w-5" />
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/minha-conta/pedidos"
                                className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                                title={`Olá, ${user?.name}`}
                            >
                                <User className="h-5 w-5" />
                                <span className="hidden sm:inline max-w-[100px] truncate">{user?.name?.split(" ")[0]}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                                title="Sair da conta"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] hover:text-[var(--muted)] transition-colors"
                            title="Entrar"
                        >
                            <User className="h-5 w-5" />
                            <span className="hidden sm:inline">Entrar</span>
                        </Link>
                    )}

                    <Link
                        href="/checkout"
                        className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--muted)] transition-colors"
                        title="Cesta de compras"
                    >
                        <div className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {count > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                                    {count}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

            </div>

            {/* Menu Mobile Expandido */}
            {isMobileMenuOpen && (
                <div className="border-b border-[var(--line)] bg-[var(--surface)] px-4 py-4 lg:hidden">
                    <nav className="flex flex-col gap-3">
                        <Link
                            href="/produtos"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
                        >
                            Catálogo de Produtos
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-base font-medium text-[var(--accent)]"
                            >
                                <Shield className="h-4 w-4" />
                                Painel Administrativo
                            </Link>
                        )}
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/minha-conta/pedidos"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-base font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
                                >
                                    Minha Conta
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-2 text-left text-base font-medium text-[var(--danger)]"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sair da Conta
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                Fazer Login / Cadastrar
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
