import { Search, Eye, Mail, MapPin, Phone } from "lucide-react";

// Mock de clientes simulando o retorno da API
const mockClientes = [
    { id: "C001", nome: "Maria Oliveira", email: "maria.oliveira@email.com", telefone: "(11) 99999-1111", cidade: "São Paulo - SP", dataCadastro: "15/08/2026", totalPedidos: 3 },
    { id: "C002", nome: "João Silva", email: "joao.silva@email.com", telefone: "(21) 98888-2222", cidade: "Rio de Janeiro - RJ", dataCadastro: "20/08/2026", totalPedidos: 1 },
    { id: "C003", nome: "Ana Costa", email: "ana.costa@email.com", telefone: "(41) 97777-3333", cidade: "Curitiba - PR", dataCadastro: "22/08/2026", totalPedidos: 5 },
    { id: "C004", nome: "Carlos Souza", email: "carlos.souza@email.com", telefone: "(31) 96666-4444", cidade: "Belo Horizonte - MG", dataCadastro: "24/08/2026", totalPedidos: 0 },
];

export default function AdminClientesPage() {
    return (
        <div className="flex flex-col gap-6">

            {/* Cabeçalho */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Clientes</h1>
                    <p className="text-sm text-[var(--muted)]">Gerencie a base de clientes cadastrados na loja.</p>
                </div>
            </div>

            {/* Barra de Busca */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar cliente por nome ou e-mail..."
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-transparent py-2 pl-9 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>
            </div>

            {/* Tabela de Clientes */}
            <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="border-b border-[var(--line)] bg-[var(--background)] text-[var(--muted)]">
                        <tr>
                            <th className="px-6 py-4 font-medium">Cliente</th>
                            <th className="px-6 py-4 font-medium">Contato</th>
                            <th className="px-6 py-4 font-medium">Localização</th>
                            <th className="px-6 py-4 font-medium">Data de Cadastro</th>
                            <th className="px-6 py-4 font-medium">Pedidos</th>
                            <th className="px-6 py-4 font-medium text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                        {mockClientes.map((cliente) => (
                            <tr key={cliente.id} className="transition-colors hover:bg-[var(--background)]">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-[var(--foreground)]">{cliente.nome}</div>
                                    <div className="text-xs text-[var(--muted)] mt-1">ID: {cliente.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                                            <Mail className="h-3.5 w-3.5 text-[var(--muted)]" /> {cliente.email}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[var(--muted)]">
                                            <Phone className="h-3.5 w-3.5" /> {cliente.telefone}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                                        <MapPin className="h-3.5 w-3.5 text-[var(--muted)]" /> {cliente.cidade}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[var(--foreground)]">{cliente.dataCadastro}</td>
                                <td className="px-6 py-4 text-[var(--foreground)]">
                                    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cliente.totalPedidos > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-[var(--muted)]"
                                        }`}>
                                        {cliente.totalPedidos} {cliente.totalPedidos === 1 ? 'pedido' : 'pedidos'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="inline-flex items-center justify-center rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                        title="Ver Histórico do Cliente"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}