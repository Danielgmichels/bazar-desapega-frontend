import Link from "next/link";
import { ShoppingBag, User, Search, Menu } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--line)] bg-[var(--background)]">
            <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Mobile: Menu Hamburguer e Logo */}
                <div className="flex items-center gap-4 lg:hidden">
                    <button className="text-[var(--foreground)]">
                        <Menu className="h-6 w-6" />
                    </button>
                    <Link href="/" className="text-xl font-medium tracking-tight">
                        bazar
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
                    </nav>
                </div>

                {/* Ações Globais: Busca, Conta e Cesta */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <button className="hidden text-[var(--foreground)] hover:text-[var(--muted)] transition-colors lg:block">
                        <Search className="h-5 w-5" />
                    </button>

                    <Link href="/login" className="text-[var(--foreground)] hover:text-[var(--muted)] transition-colors">
                        <User className="h-5 w-5" />
                    </Link>

                    <Link href="/checkout" className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--muted)] transition-colors">
                        <div className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {/* Badge indicando itens na cesta (mockado para visualização) */}
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                                1
                            </span>
                        </div>
                    </Link>
                </div>

            </div>
        </header>
    );
}