"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Eye, Loader2, PackageCheck, Plus } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { OrderResponse } from "@/contracts/order";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";

interface ConfigData {
    status_pedidos: { id_status_pedido: number; nome: string }[];
}

export default function AdminPedidosPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const { data: pedidos = [], isLoading } = useQuery<OrderResponse[]>({
        queryKey: ["admin-pedidos"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/pedidos");
            if (Array.isArray(res.data)) return res.data;
            if (Array.isArray(res.data?.data)) return res.data.data;
            return [];
        },
        staleTime: 1000 * 30,
    });

    const { data: configData } = useQuery<ConfigData>({
        queryKey: ["admin-configuracoes"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/configuracoes");
            return res.data;
        },
    });

    const statusOptions = configData?.status_pedidos?.map((s) => s.nome) || [
        "Aguardando Pagamento",
        "Pagamento Aprovado",
        "Em Separação",
        "Enviado",
        "Entregue",
        "Cancelado",
    ];

    const filtered = pedidos.filter((pedido) => {
        const idStr = String(pedido.id_pedido);
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            !searchTerm ||
            idStr.includes(search) ||
            pedido.cliente_nome?.toLowerCase().includes(search) ||
            pedido.cliente_email?.toLowerCase().includes(search);

        const matchesStatus = !selectedStatus || pedido.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Cabeçalho */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Pedidos</h1>
                    <p className="text-sm text-[var(--muted)]">
                        Acompanhe as vendas da loja online ou registre vendas diretas (Instagram, WhatsApp e loja física).
                    </p>
                </div>

                <Link
                    href="/admin/pedidos/novo"
                    className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Pedido (Venda Direta)
                </Link>
            </div>

            {/* Barra de Filtros e Busca */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por número do pedido ou cliente..."
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-transparent py-2 pl-9 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full sm:w-auto rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    >
                        <option value="">Todos os status</option>
                        {statusOptions.map((st) => (
                            <option key={st} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>

                    <span className="text-xs text-[var(--muted)] shrink-0">
                        {filtered.length} {filtered.length === 1 ? "pedido" : "pedidos"}
                    </span>
                </div>
            </div>

            {/* Tabela de Pedidos */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[var(--muted)] bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--line)]">
                    <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                    <p className="text-sm">Carregando pedidos da API...</p>
                </div>
            ) : filtered.length > 0 ? (
                <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                    <table className="w-full min-w-[800px] text-left text-sm">
                        <thead className="border-b border-[var(--line)] bg-[var(--background)] text-[var(--muted)]">
                            <tr>
                                <th className="px-6 py-4 font-medium">Pedido</th>
                                <th className="px-6 py-4 font-medium">Data</th>
                                <th className="px-6 py-4 font-medium">Cliente</th>
                                <th className="px-6 py-4 font-medium">Modalidade</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--line)]">
                            {filtered.map((pedido) => (
                                <tr key={pedido.id_pedido} className="transition-colors hover:bg-[var(--background)]">
                                    <td className="px-6 py-4 font-medium text-[var(--foreground)] font-mono text-xs">
                                        #{pedido.id_pedido}
                                    </td>
                                    <td className="px-6 py-4 text-[var(--muted)]">{pedido.data_pedido || "Recente"}</td>
                                    <td className="px-6 py-4 text-[var(--foreground)]">
                                        <div className="font-medium">{pedido.cliente_nome || "Cliente"}</div>
                                        {pedido.cliente_email && (
                                            <div className="text-xs text-[var(--muted)]">{pedido.cliente_email}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-[var(--foreground)]">
                                        {pedido.tipo_entrega_nome || "Entrega"}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                            pedido.valor_total
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <OrderStatusBadge status={pedido.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/pedidos/${pedido.id_pedido}`}
                                            className="inline-flex items-center justify-center rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                            title="Ver Detalhes do Pedido"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--muted)] py-16 text-center bg-[var(--surface)]">
                    <PackageCheck className="mb-2 h-10 w-10 text-[var(--muted)]" />
                    <p className="font-medium text-[var(--foreground)]">Nenhum pedido encontrado</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                        {searchTerm || selectedStatus
                            ? "Ajuste os filtros de status ou a busca."
                            : "Ainda não há pedidos registrados no banco de dados."}
                    </p>
                    {!searchTerm && !selectedStatus && (
                        <Link
                            href="/admin/pedidos/novo"
                            className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
                        >
                            <Plus className="h-4 w-4" />
                            Registrar Primeiro Pedido
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}