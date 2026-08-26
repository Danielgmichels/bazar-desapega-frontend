import Link from "next/link";
import { Plus, Search, Edit2, Archive } from "lucide-react";

// Mock de dados para simular a resposta da API
const mockProdutos = [
    { id: "101", foto: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=200&auto=format&fit=crop", marca: "Zara", tipo: "Casaco de Lã", tamanho: "M", preco: 189.90, status: "Disponível" },
    { id: "102", foto: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=200&auto=format&fit=crop", marca: "Levi's", tipo: "Calça Jeans 501", tamanho: "40", preco: 150.00, status: "Disponível" },
    { id: "103", foto: "https://images.unsplash.com/photo-1572804013309-84a8f14450e0?q=80&w=200&auto=format&fit=crop", marca: "Farm", tipo: "Vestido", tamanho: "P", preco: 220.00, status: "Vendido" },
];

export default function AdminProdutosPage() {
    return (
        <div className="flex flex-col gap-6">

            {/* Cabeçalho da página */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Produtos</h1>
                    <p className="text-sm text-[var(--muted)]">Gerencie o acervo e a disponibilidade das peças.</p>
                </div>

                <Link
                    href="/admin/produtos/novo"
                    className="flex items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Produto
                </Link>
            </div>

            {/* Barra de Filtros e Busca */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar por ID, marca ou tipo..."
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-transparent py-2 pl-9 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>

                <select className="w-full sm:w-auto rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]">
                    <option value="">Todos os status</option>
                    <option value="disponivel">Disponível</option>
                    <option value="vendido">Vendido</option>
                </select>
            </div>

            {/* Tabela de Produtos */}
            <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="border-b border-[var(--line)] bg-[var(--background)] text-[var(--muted)]">
                        <tr>
                            <th className="px-6 py-4 font-medium">Peça</th>
                            <th className="px-6 py-4 font-medium">ID</th>
                            <th className="px-6 py-4 font-medium">Marca</th>
                            <th className="px-6 py-4 font-medium">Tamanho</th>
                            <th className="px-6 py-4 font-medium">Preço (R$)</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                        {mockProdutos.map((produto) => (
                            <tr key={produto.id} className="transition-colors hover:bg-[var(--background)]">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-10 flex-shrink-0 overflow-hidden rounded bg-[var(--line)]">
                                            <img src={produto.foto} alt={produto.tipo} className="h-full w-full object-cover" />
                                        </div>
                                        <span className="font-medium text-[var(--foreground)]">{produto.tipo}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[var(--muted)]">#{produto.id}</td>
                                <td className="px-6 py-4 text-[var(--foreground)]">{produto.marca}</td>
                                <td className="px-6 py-4 text-[var(--foreground)]">{produto.tamanho}</td>
                                <td className="px-6 py-4 text-[var(--foreground)]">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${produto.status === 'Disponível'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-[var(--muted)]'
                                        }`}>
                                        {produto.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]" title="Editar">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button className="rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-red-100 hover:text-[var(--danger)]" title="Arquivar">
                                            <Archive className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}