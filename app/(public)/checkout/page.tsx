"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, ShoppingBag, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/providers/auth-provider";
import { api, parseApiError } from "@/lib/api/client";
import { OrderResponse } from "@/contracts/order";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, removeItem, clearCart, total } = useCart();
    const { isAuthenticated, user } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [entrega, setEntrega] = useState("1"); // 1: Correios, 2: Retirada no Local
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFinalizarPedido = async () => {
        if (items.length === 0) return;

        if (!isAuthenticated) {
            router.push("/login?redirect=/checkout");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            // Contrato documentado: POST /api/pedidos com { id_tipo_entrega, produtos: [...] }
            const payload = {
                id_tipo_entrega: Number(entrega),
                produtos: items.map((item) => Number(item.id_produto)),
            };

            const response = await api.post("/api/pedidos", payload);
            const data: OrderResponse = response.data.data ? response.data.data : response.data;

            const orderId = data.id_pedido || response.data.id || "confirmado";

            // Limpa o carrinho e redireciona para a tela de confirmação
            clearCart();
            router.push(`/checkout/sucesso/${orderId}`);
        } catch (error: any) {
            const parsed = parseApiError(error);

            // Regra de UX 9.2: Conflito de disponibilidade (422)
            if (parsed.status === 422) {
                setErrorMessage(
                    "Uma das peças acabou de ser vendida para outro cliente. Atualizamos as informações; revise os itens da cesta antes de tentar novamente."
                );
            } else {
                setErrorMessage(parsed.message || "Não foi possível concluir o pedido. Tente novamente.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-center">
                    <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-[var(--muted)]" />
                    <h1 className="text-xl font-medium tracking-tight text-[var(--foreground)]">
                        Sua cesta está vazia
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Você ainda não adicionou nenhuma peça do nosso acervo.
                    </p>
                    <Link
                        href="/produtos"
                        className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        <ArrowLeft className="h-4 w-4" /> Continuar garimpando
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link
                    href="/produtos"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continuar garimpando
                </Link>
                <h1 className="mt-4 text-3xl font-medium tracking-tight text-[var(--foreground)]">
                    Finalizar Pedido
                </h1>
            </div>

            {errorMessage && (
                <div className="mb-8 flex items-start gap-3 rounded-[var(--radius)] bg-red-50 p-4 text-sm text-[var(--danger)] border border-red-200">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-medium">Atenção: </span>
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
                {/* Lado Esquerdo: Lista de Produtos da Cesta */}
                <div className="lg:col-span-7">
                    <h2 className="text-lg font-medium text-[var(--foreground)] mb-4 border-b border-[var(--line)] pb-2 flex items-center justify-between">
                        <span>Suas peças ({items.length})</span>
                        <span className="text-xs text-[var(--muted)] font-normal">Peças únicas reservadas temporariamente</span>
                    </h2>

                    <ul className="divide-y divide-[var(--line)]">
                        {items.map((item) => {
                            const productId = item.id_produto ?? item.id;
                            const imagem = item.foto_principal || item.foto || "";
                            return (
                                <li key={String(productId)} className="flex py-6 group">
                                    {/* Link na foto para as especificações do produto */}
                                    <Link
                                        href={`/produtos/${productId}`}
                                        className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-[var(--radius)] bg-[var(--line)] border border-[var(--line)] flex items-center justify-center transition-opacity hover:opacity-85"
                                        title="Ver especificações da peça"
                                    >
                                        {imagem ? (
                                            <img
                                                src={imagem}
                                                alt={item.tipo || item.nome}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-8 w-8 text-[var(--muted)]" />
                                        )}
                                    </Link>

                                    <div className="ml-4 flex flex-1 flex-col justify-center">
                                        <div className="flex justify-between text-base font-medium text-[var(--foreground)]">
                                            {/* Link no título para as especificações do produto */}
                                            <Link
                                                href={`/produtos/${productId}`}
                                                className="hover:text-[var(--accent)] hover:underline transition-colors line-clamp-1"
                                                title="Ver especificações da peça"
                                            >
                                                <h3>{item.tipo || item.nome}</h3>
                                            </Link>
                                            <p className="ml-4 shrink-0">
                                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                                    Number(item.preco_venda) || 0
                                                )}
                                            </p>
                                        </div>

                                        <p className="mt-1 text-sm text-[var(--muted)]">
                                            {item.marca} • Tamanho {item.tamanho}
                                        </p>

                                        <div className="mt-3 flex items-center gap-4">
                                            <Link
                                                href={`/produtos/${productId}`}
                                                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] underline transition-colors"
                                            >
                                                Ver especificações
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(productId!)}
                                                className="text-xs text-[var(--danger)] cursor-pointer hover:underline inline-flex items-center gap-1"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Remover
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                </div>

                {/* Lado Direito: Resumo do Pedido e Tipo de Entrega */}
                <div className="lg:col-span-5">
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs">
                        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Resumo do pedido</h2>

                        {/* Modalidade de Entrega */}
                        <div className="mb-6 space-y-2">
                            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="entrega-select">
                                Modalidade de entrega
                            </label>
                            <select
                                id="entrega-select"
                                value={entrega}
                                onChange={(e) => setEntrega(e.target.value)}
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2.5 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            >
                                <option value="1">Correios (Envio padrão para todo Brasil)</option>
                                <option value="2">Retirada no Local (Gratuito)</option>
                            </select>
                            <p className="text-xs text-[var(--muted)]">
                                {entrega === "2"
                                    ? "Você receberá o endereço para retirada assim que o pedido for separado."
                                    : "O cálculo do frete e rastreio serão informados nos detalhes da compra."}
                            </p>
                        </div>

                        {/* Totais */}
                        <div className="space-y-3 border-t border-[var(--line)] pt-4 text-sm">
                            <div className="flex justify-between text-[var(--muted)]">
                                <p>Subtotal ({items.length} {items.length === 1 ? "peça" : "peças"})</p>
                                <p>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}</p>
                            </div>
                            <div className="flex justify-between text-[var(--muted)]">
                                <p>Frete</p>
                                <p>{entrega === "2" ? "Grátis" : "Calculado no envio"}</p>
                            </div>
                            <div className="flex justify-between border-t border-[var(--line)] pt-3 text-lg font-medium text-[var(--foreground)]">
                                <p>Total</p>
                                <p className="text-[var(--accent)]">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleFinalizarPedido}
                            disabled={isSubmitting}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Processando pedido...</span>
                                </>
                            ) : (
                                "Finalizar Pedido"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
