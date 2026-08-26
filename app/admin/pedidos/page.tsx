import Link from "next/link";
import { Search, Filter, Eye } from "lucide-react";

// Mock de pedidos simulando a API
const mockPedidos = [
    { id: "1042", cliente: "Maria Oliveira", data: "26/08/2026", total: 189.90, entrega: "Correios", status: "Aguardando Pagamento" },
    { id: "1041", cliente: "João Silva", data: "25/08/2026", total: 370.00, entrega: "Correios", status: "Em Separação" },
    { id: "1040", cliente: "Ana Costa", data: "24/08/2026", total: 150.00, entrega: "Retirada", status: "Pronto para Retirada" },
    { id: "1039", cliente: "Carlos Souza", data: "22/08/2026", total: 455.50, entrega: "Correios", status: "Enviado" },
    { id: "1038", cliente: "Beatriz Lima", data: "20/08/2026", total: 120.00, entrega: "Correios", status: "Finalizado" },
];

// Função auxiliar para definir a cor do badge baseado no status
function getStatusColor(status: string) {
    switch (status) {
        case "Aguardando Pagamento": return "bg-yellow-100 text-yellow-800";
        case "Em Separação": return "bg-blue-100 text-blue-800";
        case "Pronto para Retirada": return "bg-indigo-100 text-indigo-800";
        case "Enviado": return "bg-purple-100 text-purple-800";
        case "Finalizado": return "bg-green-100 text-green-800";
        case "Cancelado": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

export default function AdminPedidosPage() {
    return (
        <div className="flex flex-col gap-6">

            {/* Cabeçalho */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Pedidos</h1>
                    <p className="text-sm text-[var(--muted)]">Acompanhe e atualize o status das vendas.</p>
                </div>
            </div>

            {/* Barra de Filtros e Busca */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar por número do pedido ou cliente..."
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-transparent py-2 pl-9 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <select className="flex-1 sm:w-auto rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]">
                        <option value="">Status (Todos)</option>
                        <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                        <option value="Em Separação">Em Separação</option>
                        <option value="Enviado">Enviado</option>
                    </select>
                    <button className="flex items-center justify-center rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] hover:border-[var(--foreground)]">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Tabela de Pedidos */}
            <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="border-b border-[var(--line)] bg-[var(--background)] text-[var(--muted)]">
                        <tr>
                            <th className="px-6 py-4 font-medium">Pedido</th>
                            <th className="px-6 py-4 font-medium">Data</th>
                            <th className="px-6 py-4 font-medium">Cliente</th>
                            <th className="px-6 py-4 font-medium">Entrega</th>
                            <th className="px-6 py-4 font-medium">Total (R$)</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                        {mockPedidos.map((pedido) => (
                            <tr key={pedido.id} className="transition-colors hover:bg-[var(--background)]">
                                <td className="px-6 py-4 font-medium text-[var(--foreground)]">#{pedido.id}</td>
                                <td className="px-6 py-4 text-[var(--muted)]">{pedido.data}</td>
                                <td className="px-6 py-4 text-[var(--foreground)]">{pedido.cliente}</td>
                                <td className="px-6 py-4 text-[var(--foreground)]">{pedido.entrega}</td>
                                <td className="px-6 py-4 text-[var(--foreground)] font-medium">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(pedido.status)}`}>
                                        {pedido.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/pedidos/${pedido.id}`}
                                        className="inline-flex items-center justify-center rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                        title="Ver Detalhes"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}