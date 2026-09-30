"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    CreditCard,
    Box,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Save,
} from "lucide-react";
import { apiClient, parseApiError } from "@/lib/api/client";
import { OrderResponse } from "@/contracts/order";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";

interface PedidoDetalhePageProps {
    params: Promise<{ id: string }>;
}

interface ConfigData {
    status_pedidos: { id_status_pedido: number; nome: string }[];
}

export default function PedidoDetalhePage({ params }: PedidoDetalhePageProps) {
    const resolvedParams = use(params);
    const pedidoId = resolvedParams.id;
    const queryClient = useQueryClient();

    const [selectedStatusId, setSelectedStatusId] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const { data: pedido, isLoading, isError } = useQuery<OrderResponse>({
        queryKey: ["admin-pedido", pedidoId],
        queryFn: async () => {
            const res = await apiClient.get(`/api/admin/pedidos/${pedidoId}`);
            return res.data?.data || res.data;
        },
    });

    const { data: configData } = useQuery<ConfigData>({
        queryKey: ["admin-configuracoes"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/configuracoes");
            return res.data;
        },
    });

    const statusList = configData?.status_pedidos || [
        { id_status_pedido: 1, nome: "Aguardando Pagamento" },
        { id_status_pedido: 2, nome: "Pagamento Aprovado" },
        { id_status_pedido: 3, nome: "Em Separação" },
        { id_status_pedido: 4, nome: "Enviado" },
        { id_status_pedido: 5, nome: "Entregue" },
        { id_status_pedido: 6, nome: "Cancelado" },
    ];

    const handleUpdateStatus = async (statusIdToSave?: number) => {
        const targetId = statusIdToSave || Number(selectedStatusId || pedido?.id_status_pedido);
        if (!targetId) return;

        setIsUpdating(true);
        setFeedback(null);
        try {
            await apiClient.put(`/api/admin/pedidos/${pedidoId}`, {
                id_status_pedido: targetId,
            });

            await queryClient.invalidateQueries({ queryKey: ["admin-pedido", pedidoId] });
            await queryClient.invalidateQueries({ queryKey: ["admin-pedidos"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });

            setFeedback({
                type: "success",
                message: "Status do pedido atualizado com sucesso!",
            });
        } catch (err) {
            const parsed = parseApiError(err);
            setFeedback({
                type: "error",
                message: parsed.message || "Erro ao atualizar status do pedido.",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--muted)]">
                <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                <p className="text-sm">Carregando detalhes do pedido #{pedidoId}...</p>
            </div>
        );
    }

    if (isError || !pedido) {
        return (
            <div className="mx-auto max-w-3xl rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-[var(--danger)] mb-3" />
                <h2 className="text-lg font-medium text-[var(--foreground)]">Pedido não encontrado</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                    Não foi possível localizar o pedido #{pedidoId} no servidor.
                </p>
                <Link
                    href="/admin/pedidos"
                    className="mt-4 inline-flex items-center text-sm font-medium text-[var(--accent)] hover:underline"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para lista de pedidos
                </Link>
            </div>
        );
    }

    const activeStatusValue = selectedStatusId || String(pedido.id_status_pedido || "");

    const timelineSteps = statusList.filter((s) => s.nome.toLowerCase() !== "cancelado");
    const currentStepIndex = timelineSteps.findIndex(
        (s) => s.id_status_pedido === Number(pedido.id_status_pedido) || s.nome === pedido.status
    );

    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-6">
            {/* Navegação e Título */}
            <div>
                <Link
                    href="/admin/pedidos"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para pedidos
                </Link>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                            Pedido #{pedido.id_pedido}
                        </h1>
                        <OrderStatusBadge status={pedido.status} />
                    </div>

                    {/* Controle de Status Real */}
                    <div className="flex items-center gap-2">
                        <select
                            value={activeStatusValue}
                            onChange={(e) => setSelectedStatusId(e.target.value)}
                            className="rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                        >
                            {statusList.map((st) => (
                                <option key={st.id_status_pedido} value={String(st.id_status_pedido)}>
                                    {st.nome}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => handleUpdateStatus()}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
                        >
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Salvar Status
                        </button>
                    </div>
                </div>
            </div>

            {feedback && (
                <div
                    className={`flex items-center gap-2 rounded-[var(--radius)] p-4 text-sm ${
                        feedback.type === "success"
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                >
                    {feedback.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    )}
                    <span>{feedback.message}</span>
                </div>
            )}

            {/* TIMELINE VISUAL */}
            {timelineSteps.length > 0 && (
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm overflow-x-auto">
                    <div className="flex items-center justify-between relative min-w-[520px]">
                        <div className="absolute left-0 top-5 h-0.5 w-full bg-[var(--line)] z-0"></div>

                        {timelineSteps.map((passo, index) => {
                            const isCompleted = currentStepIndex >= 0 && index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const Icon =
                                index === 0
                                    ? CreditCard
                                    : index === timelineSteps.length - 1
                                    ? CheckCircle
                                    : index === timelineSteps.length - 2
                                    ? Truck
                                    : Box;

                            return (
                                <div
                                    key={passo.id_status_pedido}
                                    className="relative z-10 flex flex-col items-center gap-2 bg-[var(--surface)] px-2"
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                                            isCompleted
                                                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                                : "border-[var(--line)] bg-[var(--background)] text-[var(--muted)]"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span
                                        className={`text-xs font-medium text-center ${
                                            isCurrent ? "text-[var(--accent)] font-semibold" : "text-[var(--muted)]"
                                        }`}
                                    >
                                        {passo.nome}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LISTA DE ITENS */}
                <div className="lg:col-span-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-medium text-[var(--foreground)]">
                        Peças do Pedido ({pedido.produtos?.length || 0})
                    </h2>
                    {pedido.produtos && pedido.produtos.length > 0 ? (
                        <ul className="divide-y divide-[var(--line)]">
                            {pedido.produtos.map((item) => (
                                <li key={item.id_produto} className="flex py-4 items-center">
                                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-[var(--line)] flex items-center justify-center">
                                        {item.foto ? (
                                            <img
                                                src={item.foto}
                                                alt={item.tipo || "Peça"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Package className="h-6 w-6 text-[var(--muted)]" />
                                        )}
                                    </div>
                                    <div className="ml-4 flex flex-1 justify-between items-center">
                                        <div>
                                            <p className="font-medium text-[var(--foreground)]">
                                                {item.tipo || "Peça"} — {item.marca}
                                            </p>
                                            <p className="text-sm text-[var(--muted)]">
                                                Código #{item.id_produto} • Tamanho {item.tamanho || "Único"}
                                            </p>
                                        </div>
                                        <p className="font-medium text-[var(--foreground)]">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(Number(item.preco_venda || 0))}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-[var(--muted)] py-6 text-center">
                            Nenhum item detalhado encontrado para este pedido.
                        </p>
                    )}
                </div>

                {/* INFORMAÇÕES DO CLIENTE E TOTAL */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-[var(--foreground)]">Cliente e Entrega</h2>
                        <div className="space-y-3 text-sm text-[var(--foreground)]">
                            <div>
                                <p className="text-[var(--muted)]">Nome</p>
                                <p className="font-medium">{pedido.cliente_nome || `Cliente #${pedido.id_cliente}`}</p>
                            </div>
                            <div>
                                <p className="text-[var(--muted)]">Contato</p>
                                {pedido.cliente_email && <p>{pedido.cliente_email}</p>}
                                {pedido.cliente_telefone && <p>{pedido.cliente_telefone}</p>}
                            </div>
                            <div className="border-t border-[var(--line)] pt-3">
                                <p className="text-[var(--muted)]">Modalidade</p>
                                <p className="font-medium flex items-center gap-2 mt-0.5">
                                    <Package className="h-4 w-4 text-[var(--accent)]" />
                                    {pedido.tipo_entrega_nome || "Entrega"}
                                </p>
                                {pedido.endereco_entrega && (
                                    <p className="mt-1 text-xs text-[var(--muted)]">{pedido.endereco_entrega}</p>
                                )}
                            </div>
                            <div className="border-t border-[var(--line)] pt-3">
                                <p className="text-[var(--muted)]">Data do Pedido</p>
                                <p className="text-xs font-medium mt-0.5">{pedido.data_pedido}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <div className="flex items-center justify-between text-lg font-medium text-[var(--foreground)]">
                            <span>Total do Pedido</span>
                            <span className="text-[var(--accent)] font-semibold">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    pedido.valor_total
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
