"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, ShoppingBag, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";

interface ClienteDetalhePageProps {
    params: Promise<{ id: string }>;
}

export default function ClienteDetalhePage({ params }: ClienteDetalhePageProps) {
    const resolvedParams = use(params);
    const clienteId = resolvedParams.id;

    const { data: cliente, isLoading } = useQuery({
        queryKey: ["admin-cliente-detalhe", clienteId],
        queryFn: async () => {
            const res = await apiClient.get(`/api/admin/clientes/${clienteId}`);
            return res.data?.data || res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--muted)]">
                <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                <p className="text-sm">Carregando dados do cliente...</p>
            </div>
        );
    }

    if (!cliente) {
        return (
            <div className="mx-auto max-w-5xl py-12 text-center">
                <p className="text-[var(--muted)]">Cliente não encontrado.</p>
                <Link href="/admin/clientes" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
                    Voltar para clientes
                </Link>
            </div>
        );
    }

    const pedidos = Array.isArray(cliente.pedidos) ? cliente.pedidos : [];

    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-8">
            {/* Navegação e Título */}
            <div>
                <Link
                    href="/admin/clientes"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para clientes
                </Link>
                <div className="mt-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                            {cliente.nome}
                        </h1>
                        <p className="text-sm text-[var(--muted)] font-mono">Cliente ID: #{cliente.id}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* COLUNA ESQUERDA: Dados Pessoais e Endereço */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                            <User className="h-5 w-5 text-[var(--muted)]" /> Informações Pessoais
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[var(--muted)]">E-mail</p>
                                <p className="font-medium text-[var(--foreground)] flex items-center gap-1.5 mt-1">
                                    <Mail className="h-3.5 w-3.5" /> {cliente.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-[var(--muted)]">Telefone</p>
                                <p className="font-medium text-[var(--foreground)] flex items-center gap-1.5 mt-1">
                                    <Phone className="h-3.5 w-3.5" /> {cliente.telefone || "Não informado"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[var(--muted)]">Data de Nascimento</p>
                                <p className="font-medium text-[var(--foreground)] flex items-center gap-1.5 mt-1">
                                    <Calendar className="h-3.5 w-3.5" /> {cliente.data_nascimento || "Não informada"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[var(--muted)]">Cidade</p>
                                <p className="font-medium text-[var(--foreground)] flex items-center gap-1.5 mt-1">
                                    <MapPin className="h-3.5 w-3.5" /> {cliente.cidade || "Não informada"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[var(--muted)]" /> Endereço Cadastrado
                        </h2>
                        <p className="text-sm text-[var(--foreground)]">
                            {cliente.endereco || "Nenhum endereço cadastrado."}
                        </p>
                    </div>
                </div>

                {/* COLUNA DIREITA: Resumo e Métricas */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-[var(--muted)]" /> Resumo de Compras
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-[var(--muted)]">Total Gasto na Loja</p>
                                <p className="text-3xl font-medium text-[var(--accent)] mt-1">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                        Number(cliente.total_gasto || 0)
                                    )}
                                </p>
                            </div>
                            <div className="border-t border-[var(--line)] pt-4">
                                <p className="text-sm text-[var(--muted)]">Membro desde</p>
                                <p className="font-medium text-[var(--foreground)] mt-1">
                                    {cliente.data_cadastro || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABELA DE HISTÓRICO DE PEDIDOS */}
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                <div className="border-b border-[var(--line)] px-6 py-4">
                    <h2 className="text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-[var(--muted)]" /> Histórico de Pedidos ({pedidos.length})
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    {pedidos.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[var(--background)] text-[var(--muted)] border-b border-[var(--line)]">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Pedido</th>
                                    <th className="px-6 py-3 font-medium">Data</th>
                                    <th className="px-6 py-3 font-medium">Entrega</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--line)]">
                                {pedidos.map((pedido: any) => (
                                    <tr key={pedido.id_pedido} className="transition-colors hover:bg-[var(--background)]">
                                        <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                                            <Link href={`/admin/pedidos/${pedido.id_pedido}`} className="hover:underline font-mono">
                                                #{pedido.id_pedido}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-[var(--muted)]">{pedido.data_pedido}</td>
                                        <td className="px-6 py-4 text-[var(--foreground)]">{pedido.tipo_entrega_nome}</td>
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge status={pedido.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-[var(--foreground)]">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                                Number(pedido.valor_total || 0)
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-sm text-[var(--muted)]">
                            Este cliente ainda não realizou nenhum pedido.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}