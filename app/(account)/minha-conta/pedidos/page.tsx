"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { OrderResponse } from "@/contracts/order";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";

export default function MeusPedidosPage() {
    const { data: pedidos = [], isLoading } = useQuery<OrderResponse[]>({
        queryKey: ["meus-pedidos"],
        queryFn: async () => {
            const res = await apiClient.get("/api/meus-pedidos");
            if (Array.isArray(res.data)) return res.data;
            if (Array.isArray(res.data?.data)) return res.data.data;
            return [];
        },
        staleTime: 1000 * 30,
    });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">Histórico de Pedidos</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Acompanhe o status e os detalhes das suas compras.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-[var(--muted)]">
                    <Loader2 className="h-8 w-8 animate-spin mb-3" />
                    <p className="text-sm">Carregando seus pedidos...</p>
                </div>
            ) : pedidos.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {pedidos.map((pedido) => (
                        <div
                            key={pedido.id_pedido}
                            className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm transition-colors hover:border-neutral-300 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-[var(--foreground)]">
                                        Pedido #{pedido.id_pedido}
                                    </span>
                                    <OrderStatusBadge status={pedido.status} />
                                </div>
                                <span className="text-xs text-[var(--muted)]">
                                    Realizado em {pedido.data_pedido || "Data recente"} • {pedido.tipo_entrega_nome || "Entrega"}
                                </span>
                                {pedido.produtos && pedido.produtos.length > 0 && (
                                    <span className="text-sm text-[var(--muted)] mt-1">
                                        <strong className="font-medium text-[var(--foreground)]">Itens: </strong>
                                        {pedido.produtos.map((p) => `${p.tipo || "Peça"} (${p.marca || ""})`).join(", ")}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-[var(--line)] pt-4 sm:border-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-3">
                                <span className="text-base font-semibold text-[var(--foreground)]">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pedido.valor_total)}
                                </span>
                                <Link
                                    href={`/minha-conta/pedidos/${pedido.id_pedido}`}
                                    className="inline-flex items-center text-sm font-medium text-[var(--accent)] hover:underline"
                                >
                                    Ver detalhes <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--muted)] py-16 text-center">
                    <ShoppingBag className="mb-3 h-10 w-10 text-[var(--muted)]" />
                    <p className="font-medium text-[var(--foreground)]">Nenhum pedido encontrado</p>
                    <p className="mt-1 text-sm text-[var(--muted)] max-w-sm">
                        Você ainda não concluiu nenhuma compra no bazar. Quando finalizar um pedido, ele aparecerá aqui.
                    </p>
                    <Link
                        href="/produtos"
                        className="mt-5 rounded-[var(--radius)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
                    >
                        Explorar acervo
                    </Link>
                </div>
            )}
        </div>
    );
}