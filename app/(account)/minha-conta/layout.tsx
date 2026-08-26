"use client"; // <-- Adicionado para podermos ler a rota

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, User, LogOut } from "lucide-react";

export default function MinhaContaLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // Pega a rota atual

    // Função que decide a cor do botão baseado na rota
    const getLinkClass = (path: string) => {
        const isActive = pathname === path || pathname?.startsWith(`${path}/`);
        return isActive
            ? "flex items-center gap-3 rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm font-medium text-[var(--accent)]"
            : "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]";
    };

    return (
        <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-medium tracking-tight text-[var(--foreground)]">
                Minha Conta
            </h1>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

                <aside className="w-full shrink-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm lg:w-64">
                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/minha-conta/pedidos"
                            className={getLinkClass("/minha-conta/pedidos")}
                        >
                            <Package className="h-4 w-4" />
                            Meus Pedidos
                        </Link>

                        <Link
                            href="/minha-conta/dados"
                            className={getLinkClass("/minha-conta/dados")}
                        >
                            <User className="h-4 w-4" />
                            Meus Dados
                        </Link>

                        <div className="my-2 border-t border-[var(--line)]"></div>

                        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--danger)] transition-colors hover:bg-red-50">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </button>
                    </nav>
                </aside>

                <div className="min-w-0 flex-1">
                    {children}
                </div>

            </div>
        </div>
    );
}