"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Produto } from "@/contracts/product";
import { ProductCard } from "@/components/commerce/product-card";

// Categorias visuais em destaque
const ATALHOS_CATEGORIAS = [
    { nome: "Casacos", query: "Casacos", desc: "Peças de inverno e meia-estação" },
    { nome: "Calças", query: "Calças", desc: "Jeans e alfaiataria selecionados" },
    { nome: "Vestidos", query: "Vestidos", desc: "Modelos casuais e festivos" },
    { nome: "Camisas", query: "Camisas", desc: "Linho, algodão e estampas" },
    { nome: "Calçados", query: "Calçados", desc: "Sapatos, botas e tênis" },
];

export default function HomePage() {
    const {
        data: produtos,
        isLoading,
        isError,
        refetch,
    } = useQuery<Produto[]>({
        queryKey: ["vitrine-produtos-novidades"],
        queryFn: async () => {
            const response = await api.get("/api/produtos");
            if (Array.isArray(response.data)) {
                return response.data;
            }
            if (response.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            return [];
        },
    });

    const ultimosProdutos = produtos ? produtos.slice(0, 8) : [];

    return (
        <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8 space-y-16">

            {/* Hero Editorial (Seção 5.1) */}
            <section className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-6 py-16 sm:px-12 sm:py-24 text-center">
                <div className="mx-auto max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)] mb-4">
                        <Sparkles className="h-3.5 w-3.5" /> Curadoria & Moda Circular
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[var(--foreground)]">
                        Menos interface, mais peça.
                    </h1>
                    <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
                        Explore nosso garimpo de peças únicas, marcas conceituadas e achados sustentáveis com preços justos e checkout direto.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/produtos"
                            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
                        >
                            Ver acervo completo <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Atalhos Visuais por Categoria */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">
                            Categorias em Destaque
                        </h2>
                        <p className="text-sm text-[var(--muted)]">Encontre diretamente o que você procura</p>
                    </div>
                    <Link
                        href="/produtos"
                        className="text-sm font-medium text-[var(--accent)] hover:underline hidden sm:inline"
                    >
                        Ver todas
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {ATALHOS_CATEGORIAS.map((cat) => (
                        <Link
                            key={cat.nome}
                            href={`/produtos?tipo=${encodeURIComponent(cat.query)}`}
                            className="group flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-xs"
                        >
                            <span className="font-medium text-base text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                                {cat.nome}
                            </span>
                            <span className="mt-1 text-xs text-[var(--muted)]">{cat.desc}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Bloco de Novidades ("Acabou de Chegar") */}
            <section>
                <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-4">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">
                            Acabou de Chegar
                        </h2>
                        <p className="text-sm text-[var(--muted)]">Últimos desapegos catalogados na loja</p>
                    </div>
                    <Link
                        href="/produtos"
                        className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                        Ver acervo <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
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

                {/* Error state */}
                {isError && (
                    <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--danger)]/30 bg-red-50/50 p-8 text-center">
                        <AlertCircle className="h-8 w-8 text-[var(--danger)] mb-2" />
                        <p className="font-medium text-[var(--danger)]">Não foi possível carregar as novidades.</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">Verifique se o backend Laravel está rodando.</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-4 rounded-[var(--radius)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* Grid */}
                {!isLoading && !isError && ultimosProdutos.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {ultimosProdutos.map((produto) => (
                            <ProductCard key={produto.id_produto} {...produto} />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !isError && ultimosProdutos.length === 0 && (
                    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
                        <ShoppingBag className="h-10 w-10 text-[var(--line)] mb-2" />
                        <p className="font-medium text-[var(--foreground)]">Nenhuma peça cadastrada no momento.</p>
                        <p className="text-sm text-[var(--muted)] mt-1">Novas peças serão adicionadas em breve!</p>
                    </div>
                )}
            </section>

            {/* Bloco de Confiança (Seção 5.1) */}
            <section className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center sm:text-left">
                    <div className="flex flex-col items-center sm:items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-base text-[var(--foreground)]">Peças Únicas</h3>
                        <p className="text-sm text-[var(--muted)]">
                            Cada item do nosso bazar é exclusivo. Ao confirmar a compra, a peça é reservada imediatamente para você.
                        </p>
                    </div>

                    <div className="flex flex-col items-center sm:items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-base text-[var(--foreground)]">Compra Simples & Segura</h3>
                        <p className="text-sm text-[var(--muted)]">
                            Processo de checkout transparente e direto, sem etapas burocráticas ou taxas escondidas.
                        </p>
                    </div>

                    <div className="flex flex-col items-center sm:items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                            <Truck className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-base text-[var(--foreground)]">Envio ou Retirada Local</h3>
                        <p className="text-sm text-[var(--muted)]">
                            Escolha entre entrega pelos Correios para todo o Brasil ou retirada sem custo no nosso ponto físico.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}
