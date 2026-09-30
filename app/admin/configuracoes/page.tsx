"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Settings,
    Truck,
    Tag,
    Layers,
    Users,
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { apiClient, parseApiError } from "@/lib/api/client";

type ConfigGroupKey = "tipos_entrega" | "tipos_produto" | "generos" | "status_pedidos";

interface ConfigData {
    tipos_entrega: { id_tipo_entrega: number; nome: string }[];
    tipos_produto: { id_tipo: number; nome: string }[];
    generos: { id_genero: number; nome: string }[];
    status_pedidos: { id_status_pedido: number; nome: string }[];
}

export default function AdminConfiguracoesPage() {
    const queryClient = useQueryClient();

    const [newInputs, setNewInputs] = useState<Record<ConfigGroupKey, string>>({
        tipos_entrega: "",
        tipos_produto: "",
        generos: "",
        status_pedidos: "",
    });

    const [editingItem, setEditingItem] = useState<{
        grupo: ConfigGroupKey;
        id: number;
        nome: string;
    } | null>(null);

    const [busyAction, setBusyAction] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const { data, isLoading } = useQuery<ConfigData>({
        queryKey: ["admin-configuracoes"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/configuracoes");
            return res.data;
        },
    });

    const handleAdd = async (grupo: ConfigGroupKey, e: React.FormEvent) => {
        e.preventDefault();
        const nome = newInputs[grupo]?.trim();
        if (!nome) return;

        setBusyAction(`add-${grupo}`);
        setFeedback(null);
        try {
            await apiClient.post(`/api/admin/configuracoes/${grupo}`, { nome });
            setNewInputs((prev) => ({ ...prev, [grupo]: "" }));
            await queryClient.invalidateQueries({ queryKey: ["admin-configuracoes"] });
            setFeedback({
                type: "success",
                message: `"${nome}" adicionado com sucesso!`,
            });
        } catch (err) {
            const parsed = parseApiError(err);
            setFeedback({
                type: "error",
                message: parsed.message || "Erro ao adicionar item.",
            });
        } finally {
            setBusyAction(null);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingItem || !editingItem.nome.trim()) return;

        const { grupo, id, nome } = editingItem;
        setBusyAction(`edit-${grupo}-${id}`);
        setFeedback(null);
        try {
            await apiClient.put(`/api/admin/configuracoes/${grupo}/${id}`, { nome: nome.trim() });
            setEditingItem(null);
            await queryClient.invalidateQueries({ queryKey: ["admin-configuracoes"] });
            setFeedback({
                type: "success",
                message: "Registro atualizado com sucesso!",
            });
        } catch (err) {
            const parsed = parseApiError(err);
            setFeedback({
                type: "error",
                message: parsed.message || "Erro ao atualizar registro.",
            });
        } finally {
            setBusyAction(null);
        }
    };

    const handleDelete = async (grupo: ConfigGroupKey, id: number, nome: string) => {
        if (!window.confirm(`Deseja realmente excluir "${nome}"?`)) return;

        setBusyAction(`del-${grupo}-${id}`);
        setFeedback(null);
        try {
            await apiClient.delete(`/api/admin/configuracoes/${grupo}/${id}`);
            await queryClient.invalidateQueries({ queryKey: ["admin-configuracoes"] });
            setFeedback({
                type: "success",
                message: `"${nome}" removido com sucesso!`,
            });
        } catch (err) {
            const parsed = parseApiError(err);
            setFeedback({
                type: "error",
                message: parsed.message || "Não foi possível excluir este item pois ele está vinculado a registros existentes.",
            });
        } finally {
            setBusyAction(null);
        }
    };

    const inputClass =
        "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    const renderSection = (
        grupo: ConfigGroupKey,
        title: string,
        subtitle: string,
        icon: React.ReactNode,
        items: { id: number; nome: string }[],
        placeholder: string
    ) => (
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[var(--line)] pb-3 gap-2">
                <div>
                    <h2 className="text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                        {icon}
                        {title}
                    </h2>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{subtitle}</p>
                </div>
                <span className="text-xs font-medium text-[var(--muted)]">{items.length} cadastrado(s)</span>
            </div>

            {/* Formulário para Adicionar Novo */}
            <form onSubmit={(e) => handleAdd(grupo, e)} className="flex gap-2">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={newInputs[grupo]}
                    onChange={(e) => setNewInputs((prev) => ({ ...prev, [grupo]: e.target.value }))}
                    className={inputClass}
                />
                <button
                    type="submit"
                    disabled={busyAction === `add-${grupo}` || !newInputs[grupo]?.trim()}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
                >
                    {busyAction === `add-${grupo}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                    Adicionar
                </button>
            </form>

            {/* Lista de Itens com Edição e Exclusão */}
            <div className="divide-y divide-[var(--line)] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--background)]">
                {items.length > 0 ? (
                    items.map((item) => {
                        const isEditing = editingItem?.grupo === grupo && editingItem?.id === item.id;
                        const isDeleting = busyAction === `del-${grupo}-${item.id}`;
                        const isSavingEdit = busyAction === `edit-${grupo}-${item.id}`;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="font-mono text-xs font-semibold text-[var(--muted)] shrink-0">
                                        #{item.id}
                                    </span>

                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editingItem.nome}
                                            onChange={(e) =>
                                                setEditingItem((prev) =>
                                                    prev ? { ...prev, nome: e.target.value } : null
                                                )
                                            }
                                            className="flex-1 rounded border border-[var(--accent)] bg-[var(--surface)] px-2.5 py-1 text-sm text-[var(--foreground)] focus:outline-none"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="font-medium text-[var(--foreground)] truncate">
                                            {item.nome}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    {isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleSaveEdit}
                                                disabled={isSavingEdit}
                                                className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50"
                                                title="Salvar alteração"
                                            >
                                                {isSavingEdit ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingItem(null)}
                                                className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--line)]"
                                                title="Cancelar"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingItem({
                                                        grupo,
                                                        id: item.id,
                                                        nome: item.nome,
                                                    })
                                                }
                                                className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                                                title="Editar nome"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(grupo, item.id, item.nome)}
                                                disabled={isDeleting}
                                                className="rounded p-1.5 text-[var(--muted)] hover:bg-red-50 hover:text-[var(--danger)] disabled:opacity-40"
                                                title="Excluir item"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-6 text-center text-xs text-[var(--muted)]">
                        Nenhum registro cadastrado neste grupo.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-6">
            <div>
                <Link
                    href="/admin"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao painel
                </Link>
                <div className="mt-2">
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)] flex items-center gap-2">
                        <Settings className="h-6 w-6 text-[var(--muted)]" />
                        Configurações & Cadastros Auxiliares
                    </h1>
                    <p className="text-sm text-[var(--muted)]">
                        Adicione, edite ou remova modalidades de entrega, categorias de produtos, gêneros e status de pedidos.
                    </p>
                </div>
            </div>

            {feedback && (
                <div
                    className={`flex items-center gap-2 rounded-[var(--radius)] p-4 text-sm ${
                        feedback.type === "success"
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                >
                    {feedback.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    )}
                    <span>{feedback.message}</span>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-[var(--muted)] bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--line)]">
                    <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                    <p className="text-sm">Carregando configurações da API...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {renderSection(
                        "tipos_entrega",
                        "Modalidades de Entrega",
                        "Opções disponíveis no checkout e nos pedidos manuais",
                        <Truck className="h-4 w-4 text-[var(--accent)]" />,
                        (data?.tipos_entrega || []).map((t) => ({ id: t.id_tipo_entrega, nome: t.nome })),
                        "Ex: Motoboy Curitiba, Retirada na Loja..."
                    )}

                    {renderSection(
                        "tipos_produto",
                        "Categorias de Peças",
                        "Tipos de peça para cadastro no acervo e filtros da vitrine",
                        <Tag className="h-4 w-4 text-[var(--accent)]" />,
                        (data?.tipos_produto || []).map((t) => ({ id: t.id_tipo, nome: t.nome })),
                        "Ex: Macacão, Saia, Blazer..."
                    )}

                    {renderSection(
                        "status_pedidos",
                        "Status de Pedidos",
                        "Etapas do fluxo de pagamento, separação e entrega",
                        <Layers className="h-4 w-4 text-[var(--accent)]" />,
                        (data?.status_pedidos || []).map((s) => ({ id: s.id_status_pedido, nome: s.nome })),
                        "Ex: Pronto para Retirada, Aguardando Motoboy..."
                    )}

                    {renderSection(
                        "generos",
                        "Gêneros do Acervo",
                        "Classificação de público das peças cadastradas",
                        <Users className="h-4 w-4 text-[var(--accent)]" />,
                        (data?.generos || []).map((g) => ({ id: g.id_genero, nome: g.nome })),
                        "Ex: Feminino, Masculino, Unissex..."
                    )}
                </div>
            )}
        </div>
    );
}

