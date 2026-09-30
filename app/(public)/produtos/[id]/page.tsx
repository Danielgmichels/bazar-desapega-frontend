"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Produto, ProdutoFoto } from "@/contracts/product";
import { useCart } from "@/providers/cart-provider";
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, AlertCircle, Loader2 } from "lucide-react";

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    const router = useRouter();
    const { addItem, isInCart } = useCart();

    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    // Consulta do produto na API: GET /api/produtos/{id}
    const {
        data: produto,
        isLoading,
        isError,
    } = useQuery<Produto>({
        queryKey: ["produto-detalhe", productId],
        queryFn: async () => {
            const response = await api.get(`/api/produtos/${productId}`);
            const data = response.data;
            return data.data ? data.data : data;
        },
        enabled: Boolean(productId),
    });

    if (isLoading) {
        return (
            <main className="mx-auto max-w-[1360px] px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3 text-[var(--muted)]">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
                    <p className="text-sm">Carregando detalhes da peça...</p>
                </div>
            </main>
        );
    }

    if (isError || !produto) {
        return (
            <main className="mx-auto max-w-[1360px] px-4 py-16">
                <div className="mx-auto max-w-md rounded-[var(--radius)] border border-dashed border-[var(--danger)]/30 bg-red-50/50 p-8 text-center">
                    <AlertCircle className="mx-auto mb-3 h-10 w-10 text-[var(--danger)]" />
                    <h1 className="text-xl font-medium text-[var(--foreground)]">Peça não encontrada</h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Esta peça pode ter sido vendida ou não está mais disponível no acervo.
                    </p>
                    <Link
                        href="/produtos"
                        className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
                    </Link>
                </div>
            </main>
        );
    }

    // Monta a galeria completa de fotos
    const galeriaFotos: string[] = [];
    if (produto.fotos && produto.fotos.length > 0) {
        produto.fotos.forEach((f) => {
            if (f.caminho_arquivo) galeriaFotos.push(f.caminho_arquivo);
        });
    } else if (produto.foto_principal) {
        galeriaFotos.push(produto.foto_principal);
    } else if (produto.foto) {
        galeriaFotos.push(produto.foto);
    }

    const currentPhoto = galeriaFotos[selectedPhotoIndex] || galeriaFotos[0] || "";
    const isVendido = produto.disponibilidade === "Vendido";
    const inCart = isInCart(produto.id_produto ?? productId);

    const handleComprarAgora = () => {
        if (isVendido) return;
        addItem(produto);
        router.push("/checkout");
    };

    const handleAdicionarCesta = () => {
        if (isVendido) return;
        addItem(produto);
    };

    return (
        <main className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
            {/* Navegação de retorno */}
            <div className="mb-6">
                <Link
                    href="/produtos"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o acervo
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                {/* Lado Esquerdo: Galeria de Fotos (Col 1 a 7) */}
                <div className="flex flex-col-reverse gap-4 lg:col-span-7 lg:flex-row">
                    {/* Miniaturas (Desktop na lateral, Mobile abaixo) */}
                    {galeriaFotos.length > 1 && (
                        <div className="flex flex-row gap-3 overflow-x-auto lg:w-24 lg:flex-col lg:overflow-y-auto">
                            {galeriaFotos.map((fotoUrl, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedPhotoIndex(idx)}
                                    className={`relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-[var(--radius)] border-2 transition-all ${
                                        selectedPhotoIndex === idx
                                            ? "border-[var(--accent)] opacity-100 ring-2 ring-[var(--accent)]/30"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <img
                                        src={fotoUrl}
                                        alt={`Miniatura ${idx + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Foto Principal */}
                    <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden rounded-[var(--radius)] bg-[var(--line)] border border-[var(--line)] flex items-center justify-center">
                        {currentPhoto ? (
                            <img
                                src={currentPhoto}
                                alt={`${produto.tipo || produto.nome} - ${produto.marca}`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-[var(--muted)]">
                                <ShoppingBag className="h-16 w-16 text-[var(--line)]" />
                                <span className="mt-2 text-sm">Imagem não disponível</span>
                            </div>
                        )}

                        {isVendido && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                                <span className="rounded-full bg-white px-5 py-2 text-base font-semibold text-black uppercase tracking-wider">
                                    Peça Vendida
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lado Direito: Informações e Compra (Col 8 a 12) */}
                <div className="flex flex-col justify-start pt-2 lg:col-span-5">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                            {produto.marca}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                            Peça Única
                        </span>
                    </div>

                    <h1 className="text-3xl font-medium tracking-tight text-[var(--foreground)] sm:text-4xl">
                        {produto.tipo || produto.nome}
                    </h1>

                    <div className="my-6 border-y border-[var(--line)] py-4">
                        <p className="text-3xl font-semibold text-[var(--foreground)]">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                Number(produto.preco_venda) || 0
                            )}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                            Pagamento seguro e envio para todo o Brasil ou retirada no local.
                        </p>
                    </div>

                    {/* Especificações da Peça */}
                    <div className="mb-8 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                            Detalhes da Peça
                        </h2>
                        <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                            <div>
                                <dt className="text-[var(--muted)] text-xs">Tamanho</dt>
                                <dd className="font-medium text-[var(--foreground)] mt-0.5">{produto.tamanho}</dd>
                            </div>
                            {produto.genero && (
                                <div>
                                    <dt className="text-[var(--muted)] text-xs">Gênero</dt>
                                    <dd className="font-medium text-[var(--foreground)] mt-0.5">{produto.genero}</dd>
                                </div>
                            )}
                            {produto.cor && (
                                <div>
                                    <dt className="text-[var(--muted)] text-xs">Cor</dt>
                                    <dd className="font-medium text-[var(--foreground)] mt-0.5">{produto.cor}</dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-[var(--muted)] text-xs">Disponibilidade</dt>
                                <dd className={`font-medium mt-0.5 ${isVendido ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
                                    {produto.disponibilidade || "Disponível"}
                                </dd>
                            </div>
                        </dl>
                        {produto.descricao && (
                            <div className="mt-4 border-t border-[var(--line)] pt-3 text-sm text-[var(--muted)]">
                                <p>{produto.descricao}</p>
                            </div>
                        )}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={handleComprarAgora}
                            disabled={isVendido}
                            className="flex w-full items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-8 py-4 text-base font-medium text-white transition-all hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isVendido ? "Peça Indisponível" : "Comprar Agora"}
                        </button>

                        <button
                            type="button"
                            onClick={handleAdicionarCesta}
                            disabled={isVendido || inCart}
                            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--foreground)] bg-transparent px-8 py-3.5 text-base font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--line)] disabled:pointer-events-none disabled:opacity-50"
                        >
                            {inCart ? (
                                <>
                                    <Check className="h-5 w-5 text-[var(--success)]" /> Já adicionado à cesta
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="h-5 w-5" /> Adicionar à Cesta
                                </>
                            )}
                        </button>
                    </div>

                    {/* Selos de Confiança */}
                    <div className="mt-8 space-y-3 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
                            <span>Peça autêntica com curadoria detalhada.</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Truck className="h-4 w-4 text-[var(--accent)]" />
                            <span>Opções de envio via Correios ou retirada no local.</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
