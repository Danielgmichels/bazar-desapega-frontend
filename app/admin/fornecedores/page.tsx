import Link from "next/link";
import { Search, Plus, Mail, Phone, Edit2, Truck } from "lucide-react";

// Mock de fornecedores
const mockFornecedores = [
    { id: "F001", nome: "Boutique Vintage", contato: "Mariana", email: "contato@vintage.com", telefone: "(11) 98888-1111", dataParceria: "15/01/2026", pecasFornecidas: 45, status: "Ativo" },
    { id: "F002", nome: "Armário da Júlia", contato: "Júlia", email: "julia.desapegos@email.com", telefone: "(41) 97777-2222", dataParceria: "10/03/2026", pecasFornecidas: 12, status: "Ativo" },
    { id: "F003", nome: "Coletivo Sustentável", contato: "Pedro", email: "sac@coletivo.com", telefone: "(21) 96666-3333", dataParceria: "05/06/2026", pecasFornecidas: 8, status: "Inativo" },
];

export default function AdminFornecedoresPage() {
    return (
        <div className="flex flex-col gap-6">

            {/* Cabeçalho */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Fornecedores</h1>
                    <p className="text-sm text-[var(--muted)]">Gerencie os parceiros e a origem das peças do bazar.</p>
                </div>

                <Link
                    href="/admin/fornecedores/novo"
                    className="flex items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Fornecedor
                </Link>
            </div>

            {/* Barra de Busca */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou contato..."
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-transparent py-2 pl-9 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>
            </div>

            {/* Tabela de Fornecedores */}
            <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="border-b border-[var(--line)] bg-[var(--background)] text-[var(--muted)]">
                        <tr>
                            <th className="px-6 py-4 font-medium">Fornecedor</th>
                            <th className="px-6 py-4 font-medium">Contato Principal</th>
                            <th className="px-6 py-4 font-medium">Data de Parceria</th>
                            <th className="px-6 py-4 font-medium">Peças Fornecidas</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                        {mockFornecedores.map((fornecedor) => (
                            <tr key={fornecedor.id} className="transition-colors hover:bg-[var(--background)]">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--line)] text-[var(--muted)]">
                                            <Truck className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--foreground)]">{fornecedor.nome}</div>
                                            <div className="text-xs text-[var(--muted)] mt-0.5">ID: {fornecedor.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-[var(--foreground)]">{fornecedor.contato}</span>
                                        <span className="flex items-center gap-1.5 text-[var(--muted)]">
                                            <Mail className="h-3.5 w-3.5" /> {fornecedor.email}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[var(--muted)]">
                                            <Phone className="h-3.5 w-3.5" /> {fornecedor.telefone}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[var(--foreground)]">{fornecedor.dataParceria}</td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-[var(--foreground)]">
                                        {fornecedor.pecasFornecidas}
                                    </span>
                                    <span className="text-[var(--muted)] ml-1">cadastradas</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${fornecedor.status === 'Ativo'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-[var(--muted)]'
                                        }`}>
                                        {fornecedor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/fornecedores/${fornecedor.id}/editar`}
                                        className="inline-flex items-center justify-center rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                        title="Editar Fornecedor"
                                    >
                                        <Edit2 className="h-4 w-4" />
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