"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Truck, Calendar, ShoppingBag, Loader2, Package } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { OrderResponse } from "@/contracts/order";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";

interface PedidoDetalheClientePageProps {
    params: Promise<{ id: string }>;
}

export default function PedidoDetalheClientePage({ params }: PedidoDetalheClientePageProps) {
    const resolvedParams = use(params);
    const pedidoId = resolvedParams.id;

    const { data: pedidos = [], isLoading } = useQuery<OrderResponse[]>({
        queryKey: ["meus-pedidos"],
        queryFn: async () => {
            const res = await apiClient.get("/api/meus-pedidos");
            if (Array.isArray(res.data)) return res.data;
            if (Array.isArray(res.data?.data)) return res.data.data;
            return [];
        },
    });

    const pedido = pedidos.find((p) => String(p.id_pedido) === String(pedidoId));

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--muted)]">
                <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                <p className="text-sm">Carregando detalhes do pedido #{pedidoId}...</p>
            </div>
        );
    }

    if (!pedido) {
        return (
            <div className="flex flex-col gap-4 max-w-3xl">
                <Link
                    href="/minha-conta/pedidos"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para meus pedidos
                </Link>
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
                    <p className="font-medium text-[var(--foreground)]">Pedido #{pedidoId} não encontrado</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <div>
                <Link
                    href="/minha-conta/pedidos"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para meus pedidos
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--line)] pb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                                Pedido #{pedido.id_pedido}
                            </h1>
                            <OrderStatusBadge status={pedido.status} />
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted)] flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" /> Realizado em {pedido.data_pedido}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Modalidade e Endereço de Entrega */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm flex flex-col gap-3">
                    <h3 className="font-medium text-sm text-[var(--foreground)] flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[var(--muted)]" /> Modalidade de Entrega
                    </h3>
                    <p className="text-sm font-medium text-[var(--foreground)]">{pedido.tipo_entrega_nome || "Entrega"}</p>
                    {pedido.endereco_entrega && (
                        <div className="flex items-start gap-2 pt-2 border-t border-[var(--line)] text-xs text-[var(--muted)]">
                            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{pedido.endereco_entrega}</span>
                        </div>
                    )}
                </div>

                {/* Resumo Financeiro */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm flex flex-col gap-2.5 justify-between">
                    <h3 className="font-medium text-sm text-[var(--foreground)] flex items-center gap-2 mb-1">
                        <ShoppingBag className="h-4 w-4 text-[var(--muted)]" /> Resumo do Pedido
                    </h3>
                    <div className="flex justify-between font-semibold text-sm pt-2 border-t border-[var(--line)] text-[var(--foreground)]">
                        <span>Total do Pedido</span>
                        <span className="text-[var(--accent)]">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pedido.valor_total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Lista de Peças */}
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm overflow-hidden">
                <div className="border-b border-[var(--line)] px-5 py-3.5 bg-neutral-50/50">
                    <h3 className="font-medium text-sm text-[var(--foreground)]">Peças Selecionadas neste Pedido</h3>
                </div>
                <ul className="divide-y divide-[var(--line)]">
                    {(pedido.produtos || []).map((item) => (
                        <li key={item.id_produto} className="flex items-center p-4 sm:p-5 gap-4">
                            <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded bg-[var(--line)] border border-[var(--line)] flex items-center justify-center">
                                {item.foto ? (
                                    <img src={item.foto} alt={item.tipo || "Peça"} className="h-full w-full object-cover" />
                                ) : (
                                    <Package className="h-5 w-5 text-[var(--muted)]" />
                                )}
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <p className="font-medium text-sm text-[var(--foreground)]">{item.tipo || "Peça"}</p>
                                <p className="text-xs text-[var(--muted)]">
                                    {item.marca} • Tamanho {item.tamanho || "Único"} • Peça Única
                                </p>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-[var(--foreground)]">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    Number(item.preco_venda || 0)
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}