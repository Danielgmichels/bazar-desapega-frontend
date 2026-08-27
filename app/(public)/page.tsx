"use client"; // Necessário para usar os hooks do React e do TanStack Query

import Link from "next/link";
import { Filter, ShoppingBag, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

// Tipo básico para nos ajudar com o TypeScript (ajuste de acordo com o seu banco)
interface Produto {
    id_produto: string | number;
    marca: string;
    nome: string; // no mock chamávamos de 'tipo'
    tamanho: string;
    preco_venda: number;
    foto?: string; // opcional, caso venha de relacionamento
}

// Função que faz a requisição na API
const buscarProdutos = async (): Promise<Produto[]> => {
    const response = await api.get("/api/produtos");
    return response.data;
};

export default function HomePage() {
    // O poder do TanStack Query em ação!
    const { data: produtos, isLoading, isError } = useQuery({
        queryKey: ["vitrine-produtos"],
        queryFn: buscarProdutos,
    });

    return (
        <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">

            {/* Hero / Banner Simples */}
            <div className="mb-12 flex flex-col items-center justify-center rounded-[var(--radius)] bg-[var(--surface)] px-6 py-16 text-center border border-[var(--line)] shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--foreground)]">
                    Curadoria de peças únicas.
                </h1>
                <p className="mt-4 max-w-xl text-[var(--muted)]">
                    Explore nosso acervo de desapegos de marcas incríveis com preços acessíveis. Sustentabilidade e estilo em um só lugar.
                </p>
            </div>

            {/* Barra de Filtros Visual */}
            <div className="mb-8 flex items-center justify-between border-b border-[var(--line)] pb-4">
                <h2 className="text-xl font-medium text-[var(--foreground)]">Novidades</h2>
                <button className="flex items-center gap-2 rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]">
                    <Filter className="h-4 w-4" /> Filtros
                </button>
            </div>

            {/* Estados da Requisição */}
            {isLoading && (
                <div className="flex h-40 items-center justify-center gap-2 text-[var(--muted)]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Buscando novidades no acervo...</span>
                </div>
            )}

            {isError && (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-[var(--danger)]">
                    <p className="font-medium">Ops! Não conseguimos carregar as peças.</p>
                    <p className="text-sm">Verifique se a API do Laravel está rodando.</p>
                </div>
            )}

            {/* Grid de Produtos Dinâmico */}
            {produtos && produtos.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {produtos.map((produto) => (
                        <div key={produto.id_produto} className="group flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm transition-all hover:shadow-md">

                            <Link href={`/produtos/${produto.id_produto}`} className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[var(--radius)] bg-[var(--background)] flex items-center justify-center">
                                {/* Fallback de imagem caso a API ainda não retorne fotos */}
                                {produto.foto ? (
                                    <img
                                        src={produto.foto}
                                        alt={produto.nome}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <ShoppingBag className="h-12 w-12 text-[var(--line)]" />
                                )}
                            </Link>

                            <div className="flex flex-1 flex-col p-4">
                                <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                                    {/* Se a marca ou tamanho vierem de outra tabela/coluna, você ajusta aqui */}
                                    <span>{produto.marca || "Marca Indisponível"}</span>
                                    <span>Tam: {produto.tamanho || "-"}</span>
                                </div>
                                <Link href={`/produtos/${produto.id_produto}`} className="font-medium text-[var(--foreground)] hover:underline line-clamp-1">
                                    {produto.nome}
                                </Link>

                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <span className="font-medium text-lg text-[var(--foreground)]">
                                        {/* Validação simples para evitar erro caso o preço venha como string ou nulo */}
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(produto.preco_venda) || 0)}
                                    </span>
                                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--background)] text-[var(--foreground)] transition-colors hover:bg-[var(--accent)] hover:text-white" title="Adicionar à Cesta">
                                        <ShoppingBag className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Caso a API retorne sucesso, mas o banco esteja vazio */}
            {produtos && produtos.length === 0 && (
                <div className="flex h-40 items-center justify-center text-[var(--muted)]">
                    <p>Nenhuma peça disponível no momento. Volte mais tarde!</p>
                </div>
            )}

        </div>
    );
}