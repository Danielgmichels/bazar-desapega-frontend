"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Mail, Phone, Edit2, Truck, Loader2, Trash2, MapPin } from "lucide-react";
import { apiClient, parseApiError } from "@/lib/api/client";

interface FornecedorItem {
    id: number | string;
    id_usuario: number | string;
    nome: string;
    email: string;
    telefone?: string;
    cidade?: string;
    endereco?: string;
    pecas_fornecidas: number;
    data_parceria?: string;
    status?: string;
}

export default function AdminFornecedoresPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | number | null>(null);

    const { data: fornecedores = [], isLoading } = useQuery<FornecedorItem[]>({
        queryKey: ["admin-fornecedores"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/fornecedores");
            return Array.isArray(res.data) ? res.data : res.data?.data || [];
        },
    });

    const handleDelete = async (id: string | number, nome: string) => {
        if (!confirm(`Deseja realmente remover o fornecedor "${nome}"?`)) return;
        setDeletingId(id);
        try {
            await apiClient.delete(`/api/admin/fornecedores/${id}`);
            queryClient.invalidateQueries({ queryKey: ["admin-fornecedores"] });
        } catch (err) {
            const parsed = parseApiError(err);
            alert(parsed.message || "Não foi possível excluir este fornecedor (pode possuir peças vinculadas).");
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = fornecedores.filter((f) => {
        const s = searchTerm.toLowerCase();
        return (
            !searchTerm ||
            String(f.id).includes(s) ||
            f.nome?.toLowerCase().includes(s) ||
            f.email?.toLowerCase().includes(s)
        );
    });

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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome, ID ou e-mail..."
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-transparent py-2 pl-9 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                </div>
                <span className="text-xs text-[var(--muted)]">
                    {filtered.length} {filtered.length === 1 ? "fornecedor cadastrado" : "fornecedores cadastrados"}
                </span>
            </div>

            {/* Tabela de Fornecedores */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[var(--muted)] bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--line)]">
                    <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                    <p className="text-sm">Carregando fornecedores...</p>
                </div>
            ) : filtered.length > 0 ? (
                <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="border-b border-[var(--line)] bg-[var(--background)] text-[var(--muted)]">
                            <tr>
                                <th className="px-6 py-4 font-medium">Fornecedor</th>
                                <th className="px-6 py-4 font-medium">Contato</th>
                                <th className="px-6 py-4 font-medium">Localização</th>
                                <th className="px-6 py-4 font-medium">Peças Fornecidas</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--line)]">
                            {filtered.map((fornecedor) => (
                                <tr key={fornecedor.id} className="transition-colors hover:bg-[var(--background)]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded bg-[var(--accent-soft)] text-[var(--accent)]">
                                                <Truck className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-[var(--foreground)]">{fornecedor.nome}</div>
                                                <div className="text-xs text-[var(--muted)] mt-0.5 font-mono">ID: #{fornecedor.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                                                <Mail className="h-3.5 w-3.5 text-[var(--muted)]" /> {fornecedor.email}
                                            </span>
                                            {fornecedor.telefone && (
                                                <span className="flex items-center gap-1.5 text-[var(--muted)] text-xs">
                                                    <Phone className="h-3.5 w-3.5" /> {fornecedor.telefone}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--muted)]">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {fornecedor.cidade || "Curitiba"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-[var(--foreground)]">
                                            {fornecedor.pecas_fornecidas || 0}
                                        </span>
                                        <span className="text-[var(--muted)] ml-1">peças</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                            {fornecedor.status || "Ativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/fornecedores/${fornecedor.id}/editar`}
                                                className="inline-flex items-center justify-center rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                                title="Editar Fornecedor"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                disabled={deletingId === fornecedor.id}
                                                onClick={() => handleDelete(fornecedor.id, fornecedor.nome)}
                                                className="inline-flex items-center justify-center rounded p-1.5 text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-[var(--danger)]"
                                                title="Remover Fornecedor"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--muted)] py-16 text-center bg-[var(--surface)]">
                    <Truck className="mb-2 h-10 w-10 text-[var(--muted)]" />
                    <p className="font-medium text-[var(--foreground)]">Nenhum fornecedor cadastrado</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                        Cadastre seu primeiro parceiro/fornecedor para vincular peças do acervo.
                    </p>
                    <Link
                        href="/admin/fornecedores/novo"
                        className="mt-4 inline-flex items-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Cadastrar Fornecedor
                    </Link>
                </div>
            )}
        </div>
    );
}
