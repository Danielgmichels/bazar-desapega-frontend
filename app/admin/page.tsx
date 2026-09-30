"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    TrendingUp,
    ShoppingBag,
    Users,
    Package,
    ArrowRight,
    AlertCircle,
    Plus,
    Loader2
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { Produto } from "@/contracts/product";
import { OrderResponse } from "@/contracts/order";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";

export default function AdminDashboard() {
    // 1. Produtos reais do banco
    const { data: produtos = [], isLoading: loadingProdutos } = useQuery<Produto[]>({
        queryKey: ["admin-dashboard-produtos"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/produtos");
            return Array.isArray(res.data) ? res.data : res.data?.data || [];
        },
    });

    // 2. Pedidos reais do banco
    const { data: pedidos = [], isLoading: loadingPedidos } = useQuery<OrderResponse[]>({
        queryKey: ["admin-dashboard-pedidos"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/pedidos");
            return Array.isArray(res.data) ? res.data : res.data?.data || [];
        },
    });

    // 3. Clientes reais do banco
    const { data: clientes = [], isLoading: loadingClientes } = useQuery<any[]>({
        queryKey: ["admin-dashboard-clientes"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/clientes");
            return Array.isArray(res.data) ? res.data : res.data?.data || [];
        },
    });

    const pecasDisponiveis = produtos.filter((p) => p.disponivel !== false && p.status !== "Vendido").length;
    const pecasVendidas = produtos.filter((p) => p.disponivel === false || p.status === "Vendido").length;

    const pedidosAtencao = pedidos.filter(
        (p) =>
            p.status === "Aguardando Pagamento" ||
            p.status === "Pagamento Aprovado" ||
            p.status === "Em Separação"
    );

    const kpis = [
        {
            titulo: "Pedidos em Aberto",
            valor: loadingPedidos ? "..." : String(pedidosAtencao.length),
            variacao: pedidosAtencao.length > 0 ? "Exigem atenção operacional" : "Tudo em dia",
            icone: AlertCircle,
            positivo: pedidosAtencao.length === 0,
        },
        {
            titulo: "Peças Disponíveis",
            valor: loadingProdutos ? "..." : String(pecasDisponiveis),
            variacao: "Acervo pronto para venda",
            icone: Package,
            positivo: true,
        },
        {
            titulo: "Peças Vendidas",
            valor: loadingProdutos ? "..." : String(pecasVendidas),
            variacao: `${pedidos.length} ${pedidos.length === 1 ? "pedido registrado" : "pedidos registrados"}`,
            icone: TrendingUp,
            positivo: true,
        },
        {
            titulo: "Base de Clientes",
            valor: loadingClientes ? "..." : String(clientes.length),
            variacao: "Clientes cadastrados",
            icone: Users,
            positivo: true,
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Visão Geral</h1>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                        Resumo operacional em tempo real do Bazar Desapega.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/admin/pedidos/novo"
                        className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Pedido (Venda Direta)
                    </Link>

                    <Link
                        href="/admin/produtos/novo"
                        className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
                    >
                        <Plus className="h-4 w-4" />
                        Cadastrar Peça
                    </Link>
                </div>
            </div>

            {/* Grid de KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                    <div
                        key={kpi.titulo}
                        className="flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--muted)]">{kpi.titulo}</span>
                            <kpi.icone
                                className={`h-5 w-5 ${kpi.positivo ? "text-[var(--accent)]" : "text-amber-600"}`}
                            />
                        </div>
                        <div className="mt-4 flex flex-col gap-1">
                            <span className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                                {kpi.valor}
                            </span>
                            <span
                                className={`text-xs font-medium ${
                                    kpi.positivo ? "text-emerald-700" : "text-amber-700"
                                }`}
                            >
                                {kpi.variacao}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Lista de Ações Necessárias (Ocupa 2/3 no desktop) */}
                <div className="flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
                        <h2 className="text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-[var(--muted)]" />
                            Pedidos que exigem atenção
                        </h2>
                        <Link
                            href="/admin/pedidos"
                            className="text-sm font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
                        >
                            Ver todos <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {loadingPedidos ? (
                            <div className="flex items-center justify-center py-12 text-[var(--muted)]">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                <span className="text-sm">Carregando pedidos...</span>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <tbody className="divide-y divide-[var(--line)]">
                                    {pedidosAtencao.map((pedido) => (
                                        <tr key={pedido.id_pedido} className="transition-colors hover:bg-[var(--background)]">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-[var(--foreground)]">
                                                    #{pedido.id_pedido}
                                                </div>
                                                <div className="text-xs text-[var(--muted)] mt-0.5">
                                                    {pedido.data_pedido || "Recente"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--foreground)]">
                                                {pedido.cliente_nome || "Cliente"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <OrderStatusBadge status={pedido.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-[var(--foreground)]">
                                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                                    pedido.valor_total
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/pedidos/${pedido.id_pedido}`}
                                                    className="inline-block rounded-[var(--radius)] border border-solid border-[var(--muted)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
                                                >
                                                    Resolver
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {pedidosAtencao.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-[var(--muted)]">
                                                Nenhum pedido pendente de separação ou pagamento no momento.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Atalhos Rápidos (Ocupa 1/3 no desktop) */}
                <div className="flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm lg:col-span-1">
                    <div className="border-b border-[var(--line)] px-6 py-4">
                        <h2 className="text-base font-medium text-[var(--foreground)]">Ações Rápidas</h2>
                    </div>
                    <div className="flex flex-col p-4 gap-2">
                        <Link
                            href="/admin/pedidos/novo"
                            className="flex items-center justify-between rounded-[var(--radius)] p-3 transition-colors hover:bg-[var(--background)] border border-transparent hover:border-[var(--line)]"
                        >
                            <div>
                                <p className="font-medium text-[var(--foreground)] text-sm">Registrar Venda / Pedido</p>
                                <p className="text-xs text-[var(--muted)] mt-0.5">Vendas pelo WhatsApp, Instagram ou Presencial</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                        </Link>

                        <Link
                            href="/admin/produtos/novo"
                            className="flex items-center justify-between rounded-[var(--radius)] p-3 transition-colors hover:bg-[var(--background)] border border-transparent hover:border-[var(--line)]"
                        >
                            <div>
                                <p className="font-medium text-[var(--foreground)] text-sm">Cadastrar Produto</p>
                                <p className="text-xs text-[var(--muted)] mt-0.5">Upload de fotos e peça para o acervo</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                        </Link>

                        <Link
                            href="/admin/fornecedores/novo"
                            className="flex items-center justify-between rounded-[var(--radius)] p-3 transition-colors hover:bg-[var(--background)] border border-transparent hover:border-[var(--line)]"
                        >
                            <div>
                                <p className="font-medium text-[var(--foreground)] text-sm">Novo Fornecedor</p>
                                <p className="text-xs text-[var(--muted)] mt-0.5">Registrar novo parceiro de peças</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                        </Link>

                        <Link
                            href="/admin/configuracoes"
                            className="flex items-center justify-between rounded-[var(--radius)] p-3 transition-colors hover:bg-[var(--background)] border border-transparent hover:border-[var(--line)]"
                        >
                            <div>
                                <p className="font-medium text-[var(--foreground)] text-sm">Tabelas e Configurações</p>
                                <p className="text-xs text-[var(--muted)] mt-0.5">Gerenciar entregas, categorias e status</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
