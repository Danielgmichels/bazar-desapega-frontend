"use client";

import { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Produto } from "@/contracts/product";
import { ProductCard } from "@/components/commerce/product-card";
import { Filter, X, RotateCcw, AlertCircle, Loader2 } from "lucide-react";

// Lista de opções padrão para os filtros do bazar
const TIPOS_PREDEFINIDOS = ["Casacos", "Calças", "Vestidos", "Camisas", "Calçados", "Saias", "Acessórios"];
const GENEROS_PREDEFINIDOS = ["Feminino", "Masculino", "Unissex"];
const TAMANHOS_PREDEFINIDOS = ["PP", "P", "M", "G", "GG", "36", "38", "40", "42", "44"];

function CatalogContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Filtros atuais vindos da URL
    const tipoFiltro = searchParams.get("tipo") || "";
    const generoFiltro = searchParams.get("genero") || "";
    const tamanhoFiltro = searchParams.get("tamanho") || "";

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Consulta na API com os parâmetros da URL
    const {
        data: produtos,
        isLoading,
        isError,
        refetch,
    } = useQuery<Produto[]>({
        queryKey: ["produtos-catalogo", tipoFiltro, generoFiltro, tamanhoFiltro],
        queryFn: async () => {
            const params: Record<string, string> = {};
            if (tipoFiltro) params.tipo = tipoFiltro;
            if (generoFiltro) params.genero = generoFiltro;
            if (tamanhoFiltro) params.tamanho = tamanhoFiltro;

            const response = await api.get("/api/produtos", { params });
            // Trata formatos comuns do Laravel: array direto ou objeto { data: [...] }
            if (Array.isArray(response.data)) {
                return response.data;
            }
            if (response.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            return [];
        },
    });

    // Atualiza a URL mantendo ou limpando parâmetros
    const updateFilter = (key: string, value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (!value || current.get(key) === value) {
            current.delete(key);
        } else {
            current.set(key, value);
        }

        const query = current.toString();
        router.push(`${pathname}${query ? `?${query}` : ""}`);
    };

    const clearAllFilters = () => {
        router.push(pathname);
    };

    const activeFiltersCount = [tipoFiltro, generoFiltro, tamanhoFiltro].filter(Boolean).length;

    // Painel de Filtros (reutilizado no desktop e no drawer mobile)
    const FilterSection = () => (
        <div className="flex flex-col gap-6">
            {activeFiltersCount > 0 && (
                <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                >
                    <RotateCcw className="h-3.5 w-3.5" /> Limpar todos os filtros ({activeFiltersCount})
                </button>
            )}

            {/* Filtro: Tipo de Peça */}
            <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--foreground)] uppercase">
                    Categoria
                </h3>
                <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
                    {TIPOS_PREDEFINIDOS.map((tipo) => {
                        const isSelected = tipoFiltro.toLowerCase() === tipo.toLowerCase();
                        return (
                            <button
                                key={tipo}
                                onClick={() => updateFilter("tipo", isSelected ? "" : tipo)}
                                className={`rounded-[var(--radius)] px-3 py-1.5 text-left text-sm transition-colors ${
                                    isSelected
                                        ? "bg-[var(--accent)] text-white font-medium"
                                        : "bg-[var(--surface)] border border-[var(--line)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] lg:border-none lg:bg-transparent lg:hover:bg-[var(--line)]"
                                }`}
                            >
                                {tipo}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filtro: Gênero */}
            <div className="border-t border-[var(--line)] pt-5">
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--foreground)] uppercase">
                    Gênero
                </h3>
                <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
                    {GENEROS_PREDEFINIDOS.map((genero) => {
                        const isSelected = generoFiltro.toLowerCase() === genero.toLowerCase();
                        return (
                            <button
                                key={genero}
                                onClick={() => updateFilter("genero", isSelected ? "" : genero)}
                                className={`rounded-[var(--radius)] px-3 py-1.5 text-left text-sm transition-colors ${
                                    isSelected
                                        ? "bg-[var(--accent)] text-white font-medium"
                                        : "bg-[var(--surface)] border border-[var(--line)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] lg:border-none lg:bg-transparent lg:hover:bg-[var(--line)]"
                                }`}
                            >
                                {genero}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filtro: Tamanho */}
            <div className="border-t border-[var(--line)] pt-5">
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--foreground)] uppercase">
                    Tamanho
                </h3>
                <div className="grid grid-cols-4 gap-1.5">
                    {TAMANHOS_PREDEFINIDOS.map((tamanho) => {
                        const isSelected = tamanhoFiltro.toLowerCase() === tamanho.toLowerCase();
                        return (
                            <button
                                key={tamanho}
                                onClick={() => updateFilter("tamanho", isSelected ? "" : tamanho)}
                                className={`flex items-center justify-center rounded-[var(--radius)] py-2 text-xs font-medium border transition-colors ${
                                    isSelected
                                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                        : "border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--foreground)]"
                                }`}
                            >
                                {tamanho}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <main className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
            {/* Barra Superior do Catálogo */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--line)] pb-4">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                        Acervo de Peças
                    </h1>
                    <p className="text-sm text-[var(--muted)] mt-0.5">
                        {produtos ? `${produtos.length} peças encontradas` : "Carregando catálogo..."}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)] lg:hidden"
                    >
                        <Filter className="h-4 w-4" />
                        Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </button>
                </div>
            </div>

            {/* Layout Principal: Sidebar Desktop + Grid de Produtos */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
                {/* Sidebar Desktop (280px) */}
                <aside className="hidden lg:block w-[280px] shrink-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs">
                    <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-3">
                        <span className="font-medium text-base text-[var(--foreground)] flex items-center gap-2">
                            <Filter className="h-4 w-4 text-[var(--muted)]" /> Filtros
                        </span>
                    </div>
                    <FilterSection />
                </aside>

                {/* Conteúdo: Loading, Erro, Vazio ou Grid */}
                <div className="flex-1 min-w-0">
                    {isLoading && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div
                                    key={i}
                                    className="animate-pulse flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-3"
                                >
                                    <div className="aspect-[3/4] w-full rounded bg-[var(--line)]" />
                                    <div className="h-4 w-3/4 rounded bg-[var(--line)]" />
                                    <div className="h-4 w-1/2 rounded bg-[var(--line)]" />
                                </div>
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--danger)]/40 bg-red-50/50 p-8 text-center">
                            <AlertCircle className="h-10 w-10 text-[var(--danger)] mb-2" />
                            <h3 className="text-base font-medium text-[var(--danger)]">
                                Não foi possível carregar as peças do acervo.
                            </h3>
                            <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
                                Verifique a conexão com a API do Laravel e tente novamente.
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="mt-4 rounded-[var(--radius)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {!isLoading && !isError && produtos && produtos.length === 0 && (
                        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-center">
                            <h3 className="text-lg font-medium text-[var(--foreground)]">
                                Nenhuma peça encontrada com esses filtros
                            </h3>
                            <p className="mt-2 text-sm text-[var(--muted)] max-w-md">
                                Tente alterar ou limpar os filtros selecionados para explorar outros itens do nosso acervo.
                            </p>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="mt-6 rounded-[var(--radius)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                                >
                                    Limpar Filtros
                                </button>
                            )}
                        </div>
                    )}

                    {!isLoading && !isError && produtos && produtos.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                            {produtos.map((produto) => (
                                <ProductCard key={produto.id_produto} {...produto} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Drawer Mobile de Filtros */}
            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsMobileFiltersOpen(false)}
                    />
                    <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-[var(--surface)] p-6 shadow-xl overflow-y-auto">
                        <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-4">
                            <span className="text-lg font-medium text-[var(--foreground)]">Filtros</span>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="text-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <FilterSection />
                        <div className="mt-8 border-t border-[var(--line)] pt-4">
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full rounded-[var(--radius)] bg-[var(--accent)] py-3 text-sm font-medium text-white"
                            >
                                Ver resultados ({produtos?.length || 0})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-[var(--muted)]">Carregando catálogo...</div>}>
            <CatalogContent />
        </Suspense>
    );
}
