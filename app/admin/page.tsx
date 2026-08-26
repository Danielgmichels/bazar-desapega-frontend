import Link from "next/link";
import {
    TrendingUp,
    ShoppingBag,
    Users,
    Package,
    ArrowRight,
    AlertCircle
} from "lucide-react";

// Mocks para o Dashboard
const kpis = [
    { titulo: "Receita do Mês", valor: "R$ 12.450,00", variacao: "+15%", icone: TrendingUp, positivo: true },
    { titulo: "Pedidos Pendentes", valor: "8", variacao: "Atenção necessária", icone: AlertCircle, positivo: false },
    { titulo: "Peças Disponíveis", valor: "342", variacao: "+12 novas hoje", icone: Package, positivo: true },
    { titulo: "Total de Clientes", valor: "1.205", variacao: "+5 essa semana", icone: Users, positivo: true },
];

const pedidosPendentes = [
    { id: "1042", cliente: "Maria Oliveira", total: 189.90, status: "Aguardando Pagamento", data: "Hoje, 14:30" },
    { id: "1041", cliente: "João Silva", total: 370.00, status: "Em Separação", data: "Hoje, 10:15" },
    { id: "1039", cliente: "Ana Costa", total: 150.00, status: "Em Separação", data: "Ontem, 16:45" },
];

export default function AdminDashboard() {
    return (
        <div className="flex flex-col gap-8">

            {/* Cabeçalho */}
            <div>
                <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Visão Geral</h1>
                <p className="mt-1 text-sm text-[var(--muted)]">Bem-vindo ao painel. Aqui está o resumo da sua operação hoje.</p>
            </div>

            {/* Grid de KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                    <div key={kpi.titulo} className="flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--muted)]">{kpi.titulo}</span>
                            <kpi.icone className={`h-5 w-5 ${kpi.positivo ? 'text-[var(--muted)]' : 'text-[var(--danger)]'}`} />
                        </div>
                        <div className="mt-4 flex flex-col gap-1">
                            <span className="text-2xl font-medium tracking-tight text-[var(--foreground)]">{kpi.valor}</span>
                            <span className={`text-xs font-medium ${kpi.positivo ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}`}>
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
                        <Link href="/admin/pedidos" className="text-sm font-medium text-[var(--accent)] hover:underline flex items-center gap-1">
                            Ver todos <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <tbody className="divide-y divide-[var(--line)]">
                                {pedidosPendentes.map((pedido) => (
                                    <tr key={pedido.id} className="transition-colors hover:bg-[var(--background)]">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[var(--foreground)]">#{pedido.id}</div>
                                            <div className="text-xs text-[var(--muted)] mt-0.5">{pedido.data}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[var(--foreground)]">{pedido.cliente}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${pedido.status === 'Aguardando Pagamento' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {pedido.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-[var(--foreground)]">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/pedidos/${pedido.id}`}
                                                className="inline-block rounded-[var(--radius)] border border-solid border-[var(--muted)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
                                            >
                                                Resolver
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {pedidosPendentes.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">
                                            Nenhum pedido pendente. Tudo em dia! 🎉
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Atalhos Rápidos (Ocupa 1/3 no desktop) */}
                <div className="flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm lg:col-span-1">
                    <div className="border-b border-[var(--line)] px-6 py-4">
                        <h2 className="text-base font-medium text-[var(--foreground)]">Ações Rápidas</h2>
                    </div>
                    <div className="flex flex-col p-4 gap-2">
                        <Link href="/admin/produtos/novo" className="flex items-center justify-between rounded-[var(--radius)] p-3 transition-colors hover:bg-[var(--background)] border border-transparent hover:border-[var(--line)]">
                            <div>
                                <p className="font-medium text-[var(--foreground)] text-sm">Cadastrar Produto</p>
                                <p className="text-xs text-[var(--muted)] mt-0.5">Adicionar nova peça ao acervo</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                        </Link>

                        <Link href="/admin/fornecedores/novo" className="flex items-center justify-between rounded-[var(--radius)] p-3 transition-colors hover:bg-[var(--background)] border border-transparent hover:border-[var(--line)]">
                            <div>
                                <p className="font-medium text-[var(--foreground)] text-sm">Novo Fornecedor</p>
                                <p className="text-xs text-[var(--muted)] mt-0.5">Registrar novo parceiro</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                        </Link>

                        <Link href="/admin/configuracoes" className="flex items-center justify-between rounded-[var(--radius)] p-3 transition-colors hover:bg-[var(--background)] border border-transparent hover:border-[var(--line)]">
                            <div>
                                <p className="font-medium text-[var(--foreground)] text-sm">Ajustar Frete</p>
                                <p className="text-xs text-[var(--muted)] mt-0.5">Configurações de entrega e taxas</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}