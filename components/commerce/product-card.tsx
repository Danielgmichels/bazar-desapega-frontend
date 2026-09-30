"use client";

import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { Produto } from "@/contracts/product";

interface ProductCardProps {
    id?: string | number;
    id_produto?: string | number;
    marca: string;
    tipo?: string;
    nome?: string;
    tamanho: string;
    preco?: number;
    preco_venda?: number;
    imageUrl?: string;
    foto?: string;
    foto_principal?: string;
}

export function ProductCard(props: ProductCardProps) {
    const { addItem, isInCart } = useCart();

    const productId = props.id_produto ?? props.id ?? "";
    const marca = props.marca || "Bazar Desapega";
    const tipo = props.tipo || props.nome || "Peça Única";
    const tamanho = props.tamanho || "-";
    const preco = Number(props.preco_venda ?? props.preco ?? 0);
    const imagem = props.foto_principal || props.foto || props.imageUrl || "";

    const inCart = isInCart(productId);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const produtoParaCesta: Produto = {
            id_produto: productId,
            marca,
            tipo,
            tamanho,
            preco_venda: preco,
            foto_principal: imagem,
        };

        addItem(produtoParaCesta);
    };

    return (
        <div className="group relative flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-xs transition-all hover:shadow-md">
            {/* Link para o detalhe */}
            <Link href={`/produtos/${productId}`} className="flex flex-col">
                {/* Moldura da foto */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[calc(var(--radius)-4px)] bg-[var(--background)] flex items-center justify-center">
                    {imagem ? (
                        <img
                            src={imagem}
                            alt={`${tipo} - ${marca}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-[var(--muted)]">
                            <ShoppingBag className="h-10 w-10 text-[var(--line)]" />
                            <span className="mt-2 text-xs">Sem foto</span>
                        </div>
                    )}
                </div>

                {/* Informações da peça */}
                <div className="mt-3 flex flex-1 flex-col">
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                        <span className="truncate max-w-[120px] font-medium uppercase tracking-wider">{marca}</span>
                        <span>Tam: {tamanho}</span>
                    </div>

                    <h3 className="mt-1 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                        {tipo}
                    </h3>

                    <div className="mt-3 flex items-center justify-between pt-1 border-t border-[var(--line)]">
                        <span className="text-base font-semibold text-[var(--foreground)]">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preco)}
                        </span>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={inCart}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                                inCart
                                    ? "bg-[var(--success)] text-white cursor-default"
                                    : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white"
                            }`}
                            title={inCart ? "Item na cesta" : "Adicionar à cesta"}
                            aria-label={inCart ? "Item na cesta" : "Adicionar à cesta"}
                        >
                            {inCart ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
}
