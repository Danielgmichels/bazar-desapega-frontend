"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit2, ExternalLink, Loader2, PackageX, Trash2 } from "lucide-react";
import { apiClient, parseApiError } from "@/lib/api/client";
import { Produto } from "@/contracts/product";

export default function AdminProdutosPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [deletingId, setDeletingId] = useState<string | number | null>(null);

    const { data: produtos = [], isLoading } = useQuery<Produto[]>({
        queryKey: ["admin-produtos"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/produtos");
            return Array.isArray(res.data) ? res.data : res.data?.data || [];
        },
    });

    const handleDelete = async (id: string | number, nome: string) => {
        if (!confirm(`Deseja realmente remover a peça "${nome}" (#${id}) do acervo?`)) return;
        setDeletingId(id);
        try {
            await apiClient.delete(`/api/admin/produtos/${id}`);
            queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });
            queryClient.invalidateQueries({ queryKey: ["admin-dashboard-produtos"] });
        } catch (err) {
            const parsed = parseApiError(err);
            alert(parsed.message || "Não foi possível excluir esta peça (pode estar vinculada a um pedido).");
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = produtos.filter((p) => {
        const idStr = String(p.id_produto ?? p.id);
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            !searchTerm ||
            idStr.includes(search) ||
            p.marca?.toLowerCase().includes(search) ||
            p.tipo?.toLowerCase().includes(search);

        let matchesStatus = true;
        if (statusFilter === "disponivel") {
            matchesStatus = p.disponivel !== false && p.status !== "Vendido";
        } else if (statusFilter === "vendido") {
            matchesStatus = p.disponivel === false || p.status === "Vendido";
        }

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Cabeçalho */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Produtos</h1>
                    <p className="text-sm text-[var(--muted)]">Gerencie o acervo, preços e a disponibilidade das peças.</p>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por ID, marca ou tipo..."
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-transparent py-2 pl-9 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    >
                        <option value="">Todos os status</option>
                        <option value="disponivel">Disponível</option>
                        <option value="vendido">Vendido</option>
                    </select>

                    <span className="text-xs text-[var(--muted)] shrink-0">
                        {filtered.length} {filtered.length === 1 ? "peça" : "peças"}
                    </span>
                </div>
            </div>

            {/* Tabela de Produtos */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[var(--muted)] bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--line)]">
                    <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                    <p className="text-sm">Carregando acervo de produtos...</p>
                </div>
            ) : filtered.length > 0 ? (
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
                            {filtered.map((produto) => {
                                const prodId = produto.id_produto ?? produto.id!;
                                const isDisponivel = produto.disponivel !== false && produto.status !== "Vendido";
                                const foto = produto.foto_principal || produto.fotos?.[0]?.url_foto || "";

                                return (
                                    <tr key={prodId} className="transition-colors hover:bg-[var(--background)]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-10 flex-shrink-0 overflow-hidden rounded bg-[var(--line)] border border-[var(--line)]">
                                                    {foto ? (
                                                        <img src={foto} alt={produto.tipo} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-[10px] text-[var(--muted)]">
                                                            Sem foto
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-[var(--foreground)]">{produto.tipo}</span>
                                                    <span className="text-xs text-[var(--muted)]">{produto.genero || "Unissex"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[var(--muted)] font-mono text-xs">#{prodId}</td>
                                        <td className="px-6 py-4 text-[var(--foreground)]">{produto.marca}</td>
                                        <td className="px-6 py-4 text-[var(--foreground)]">{produto.tamanho}</td>
                                        <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                                Number(produto.preco_venda || 0)
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    isDisponivel
                                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                                                }`}
                                            >
                                                {isDisponivel ? "Disponível" : "Vendido"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Link
                                                    href={`/produtos/${prodId}`}
                                                    target="_blank"
                                                    className="rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                                    title="Ver na loja"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/produtos/${prodId}/editar`}
                                                    className="rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                                    title="Editar peça"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    disabled={deletingId === prodId}
                                                    onClick={() => handleDelete(prodId, produto.tipo || produto.marca)}
                                                    className="rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-[var(--danger)]"
                                                    title="Excluir peça"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--muted)] py-16 text-center bg-[var(--surface)]">
                    <PackageX className="mb-2 h-10 w-10 text-[var(--muted)]" />
                    <p className="font-medium text-[var(--foreground)]">Nenhuma peça cadastrada no acervo</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                        Comece cadastrando suas peças para que apareçam aqui e na vitrine.
                    </p>
                    <Link
                        href="/admin/produtos/novo"
                        className="mt-4 inline-flex items-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Cadastrar Primeira Peça
                    </Link>
                </div>
            )}
        </div>
    );
}