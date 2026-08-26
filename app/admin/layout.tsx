"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Tags,
    ShoppingBag,
    Users,
    Truck,
    Settings,
    Menu,
    X,
    UserCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

// Lista de rotas administrativas exigidas pela especificação
const adminLinks = [
    { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/admin/produtos", label: "Produtos", icon: Tags },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/fornecedores", label: "Fornecedores", icon: Truck },
    { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false); // <-- NOVO ESTADO
    const pathname = usePathname(); // Ajuda a saber qual tela está ativa para pintar o botão

    return (
        <div className="min-h-screen bg-[var(--background)] flex">

            {/* SIDEBAR DESKTOP (Fixa na esquerda) */}
            <aside
                className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:border-r lg:border-[var(--line)] lg:bg-[var(--surface)] lg:shadow-sm lg:z-20 transition-all duration-300 ${isDesktopCollapsed ? "lg:w-20" : "lg:w-64"
                    }`}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--line)] px-4">
                    {!isDesktopCollapsed && (
                        <Link href="/admin" className="text-xl font-medium tracking-tight truncate px-2">
                            bazar <span className="text-[var(--accent)]">admin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)] transition-colors mx-auto"
                    >
                        {isDesktopCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </button>
                </div>
                <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
                    {adminLinks.map((link) => {
                        const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                title={isDesktopCollapsed ? link.label : ""} // Mostra o nome ao passar o mouse se estiver encolhido
                                className={`flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                                    : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                    }`}
                            >
                                <link.icon className="h-5 w-5 shrink-0" />
                                {!isDesktopCollapsed && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* OVERLAY E SIDEBAR MOBILE (Drawer) */}
            {isMobileMenuOpen && (
                <div className="relative z-50 lg:hidden">
                    {/* Fundo escuro */}
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {/* Menu lateral mobile */}
                    <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-[var(--surface)] shadow-xl">
                        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--line)] px-6">
                            <span className="text-xl font-medium tracking-tight">bazar admin</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                            {adminLinks.map((link) => {
                                const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)} // Fecha o menu ao clicar
                                        className={`flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-colors ${isActive
                                            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                                            : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                            }`}
                                    >
                                        <link.icon className="h-5 w-5" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* ÁREA DE CONTEÚDO PRINCIPAL */}
            <main className={`flex flex-1 flex-col min-w-0 w-full transition-all duration-300 ${isDesktopCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>                {/* TOPO DO ADMIN (Header) */}
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-[var(--foreground)] hover:text-[var(--muted)]"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex flex-1 justify-end items-center gap-4">
                        {/* Atalho rápido e Perfil (conforme especificação) */}
                        <Link href="/" target="_blank" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors hidden sm:block">
                            Ver vitrine
                        </Link>
                        <div className="h-8 w-8 rounded-full bg-[var(--line)] flex items-center justify-center text-[var(--muted)] cursor-pointer">
                            <UserCircle className="h-6 w-6" />
                        </div>
                    </div>
                </header>

                {/* O conteúdo das páginas admin será injetado aqui */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
                    {children}
                </div>
            </main>

        </div>
    );
}