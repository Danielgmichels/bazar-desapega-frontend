"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Search,
    Plus,
    Trash2,
    UserPlus,
    ShoppingBag,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    Check,
} from "lucide-react";
import { apiClient, parseApiError } from "@/lib/api/client";
import { Product } from "@/contracts/product";

const CIDADES_PADRAO = [
    { id_cidade: 4007, nome: "Curitiba - PR" },
    { id_cidade: 4105, nome: "Londrina - PR" },
    { id_cidade: 4123, nome: "Maringá - PR" },
    { id_cidade: 3832, nome: "São Paulo - SP" },
    { id_cidade: 3243, nome: "Rio de Janeiro - RJ" },
    { id_cidade: 4401, nome: "Florianópolis - SC" },
    { id_cidade: 4932, nome: "Porto Alegre - RS" },
    { id_cidade: 2310, nome: "Belo Horizonte - MG" },
    { id_cidade: 5570, nome: "Brasília - DF" },
];

interface ClienteOption {
    id_usuario: number;
    nome: string;
    email?: string;
    telefone?: string;
}

interface ConfigData {
    tipos_entrega: { id_tipo_entrega: number; nome: string }[];
    status_pedidos: { id_status_pedido: number; nome: string }[];
}

export default function NovoPedidoAdminPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [selectedClienteId, setSelectedClienteId] = useState<string>("");
    const [selectedTipoEntrega, setSelectedTipoEntrega] = useState<string>("1");
    const [selectedStatusPedido, setSelectedStatusPedido] = useState<string>("2"); // Pagamento Aprovado por padrão em venda direta
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [productSearch, setProductSearch] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Modal de Novo Cliente Rápido (para vendas de Instagram / WhatsApp / Amigos)
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isCreatingClient, setIsCreatingClient] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);
    const [newClient, setNewClient] = useState({
        nome: "",
        telefone: "",
        email: "",
        id_cidade: "4007",
        endereco: "",
    });

    // Busca clientes reais
    const { data: clientes = [], isLoading: isLoadingClientes } = useQuery<ClienteOption[]>({
        queryKey: ["admin-clientes"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/clientes");
            const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
            return raw.map((c: Record<string, unknown>) => ({
                id_usuario: Number(c.id_usuario || c.id),
                nome: String(c.nome || `Cliente #${c.id_usuario}`),
                email: String(c.email || ""),
                telefone: String(c.telefone || ""),
            }));
        },
    });

    // Busca produtos disponíveis no acervo
    const { data: produtos = [], isLoading: isLoadingProdutos } = useQuery<Product[]>({
        queryKey: ["admin-produtos"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/produtos");
            const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
            return raw;
        },
    });

    // Busca tipos de entrega e status de pedido
    const { data: configData } = useQuery<ConfigData>({
        queryKey: ["admin-configuracoes"],
        queryFn: async () => {
            const res = await apiClient.get("/api/admin/configuracoes");
            return res.data;
        },
    });

    const tiposEntrega = configData?.tipos_entrega || [
        { id_tipo_entrega: 1, nome: "Retirada no Local" },
        { id_tipo_entrega: 2, nome: "Correios - PAC" },
        { id_tipo_entrega: 3, nome: "Correios - SEDEX" },
        { id_tipo_entrega: 4, nome: "Transportadora" },
    ];

    const statusPedidos = configData?.status_pedidos || [
        { id_status_pedido: 1, nome: "Aguardando Pagamento" },
        { id_status_pedido: 2, nome: "Pagamento Aprovado" },
        { id_status_pedido: 3, nome: "Em Separação" },
        { id_status_pedido: 4, nome: "Enviado" },
        { id_status_pedido: 5, nome: "Entregue" },
    ];

    // Filtra apenas peças disponíveis no estoque
    const availableProducts = produtos.filter((p) => {
        const isDisp = p.disponivel !== false && p.status !== "Vendido" && p.status !== "Indisponível";
        if (!isDisp) return false;

        if (!productSearch.trim()) return true;
        const term = productSearch.toLowerCase();
        return (
            String(p.id_produto).includes(term) ||
            p.marca?.toLowerCase().includes(term) ||
            p.tipo?.toLowerCase().includes(term) ||
            p.tamanho?.toLowerCase().includes(term) ||
            p.cor?.toLowerCase().includes(term)
        );
    });

    const toggleSelectProduct = (product: Product) => {
        setSelectedProducts((prev) => {
            const exists = prev.some((item) => item.id_produto === product.id_produto);
            if (exists) {
                return prev.filter((item) => item.id_produto !== product.id_produto);
            }
            return [...prev, product];
        });
    };

    const totalOrderValue = selectedProducts.reduce((acc, item) => acc + Number(item.preco_venda || 0), 0);

    const handleCreateClientQuick = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError(null);

        if (!newClient.nome.trim() || !newClient.telefone.trim()) {
            setClientError("Informe pelo menos o nome e o telefone/WhatsApp do cliente.");
            return;
        }

        setIsCreatingClient(true);
        try {
            const res = await apiClient.post("/api/admin/clientes", {
                nome: newClient.nome.trim(),
                telefone: newClient.telefone.trim(),
                email: newClient.email.trim() || undefined,
                id_cidade: Number(newClient.id_cidade),
                endereco: newClient.endereco.trim() || "Venda Direta (Instagram / WhatsApp / Loja)",
            });

            const createdId = String(res.data?.id_usuario || res.data?.id || "");
            await queryClient.invalidateQueries({ queryKey: ["admin-clientes"] });

            if (createdId) {
                setSelectedClienteId(createdId);
            }

            setIsClientModalOpen(false);
            setNewClient({
                nome: "",
                telefone: "",
                email: "",
                id_cidade: "4007",
                endereco: "",
            });
        } catch (err) {
            const parsed = parseApiError(err);
            setClientError(parsed.message || "Erro ao cadastrar cliente.");
        } finally {
            setIsCreatingClient(false);
        }
    };

    const handleFinalizarPedido = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (selectedProducts.length === 0) {
            setFeedback({
                type: "error",
                message: "Selecione pelo menos 1 peça disponível para registrar o pedido.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                id_cliente: selectedClienteId ? Number(selectedClienteId) : undefined,
                id_tipo_entrega: Number(selectedTipoEntrega),
                id_status_pedido: Number(selectedStatusPedido),
                produtos: selectedProducts.map((p) => Number(p.id_produto)),
            };

            const res = await apiClient.post("/api/admin/pedidos", payload);
            const novoPedidoId = res.data?.id_pedido;

            await queryClient.invalidateQueries({ queryKey: ["admin-pedidos"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-clientes"] });

            setFeedback({
                type: "success",
                message: `Pedido #${novoPedidoId || ""} registrado com sucesso! As peças foram baixadas do estoque.`,
            });

            setTimeout(() => {
                if (novoPedidoId) {
                    router.push(`/admin/pedidos/${novoPedidoId}`);
                } else {
                    router.push("/admin/pedidos");
                }
            }, 1000);
        } catch (err) {
            const parsed = parseApiError(err);
            setFeedback({
                type: "error",
                message: parsed.message || "Não foi possível registrar o pedido.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    return (
        <div className="mx-auto max-w-6xl flex flex-col gap-6">
            {/* Cabeçalho */}
            <div>
                <Link
                    href="/admin/pedidos"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para pedidos
                </Link>
                <h1 className="mt-2 text-2xl font-medium tracking-tight text-[var(--foreground)]">
                    Novo Pedido Manual (Venda Direta)
                </h1>
                <p className="text-sm text-[var(--muted)]">
                    Registre vendas feitas pelo Instagram, WhatsApp, amigos ou presencialmente no brechó e dê baixa automática no acervo.
                </p>
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

            <form onSubmit={handleFinalizarPedido} className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
                {/* COLUNA ESQUERDA (2/3): CLIENTE + SELEÇÃO DE PEÇAS */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    {/* 1. Dados do Cliente e Entrega */}
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                            <h2 className="text-base font-medium text-[var(--foreground)]">1. Cliente & Canal de Entrega</h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setClientError(null);
                                    setIsClientModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                            >
                                <UserPlus className="h-3.5 w-3.5" />
                                + Cadastrar novo cliente rápido
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-sm font-medium text-[var(--foreground)]">Cliente Comprador</label>
                                <select
                                    value={selectedClienteId}
                                    onChange={(e) => setSelectedClienteId(e.target.value)}
                                    className={inputClass}
                                    disabled={isLoadingClientes}
                                >
                                    <option value="">
                                        Venda Balcão / Presencial (Sem cliente específico ou usar conta atual)
                                    </option>
                                    {clientes.map((c) => (
                                        <option key={c.id_usuario} value={String(c.id_usuario)}>
                                            {c.nome} {c.telefone ? `— ${c.telefone}` : ""} {c.email ? `(${c.email})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[var(--foreground)]">Modalidade de Entrega</label>
                                <select
                                    value={selectedTipoEntrega}
                                    onChange={(e) => setSelectedTipoEntrega(e.target.value)}
                                    className={inputClass}
                                >
                                    {tiposEntrega.map((t) => (
                                        <option key={t.id_tipo_entrega} value={String(t.id_tipo_entrega)}>
                                            {t.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[var(--foreground)]">Status Inicial do Pedido</label>
                                <select
                                    value={selectedStatusPedido}
                                    onChange={(e) => setSelectedStatusPedido(e.target.value)}
                                    className={inputClass}
                                >
                                    {statusPedidos.map((s) => (
                                        <option key={s.id_status_pedido} value={String(s.id_status_pedido)}>
                                            {s.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. Seleção de Peças Disponíveis no Acervo */}
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--line)] pb-3">
                            <div>
                                <h2 className="text-base font-medium text-[var(--foreground)]">
                                    2. Selecionar Peças do Acervo
                                </h2>
                                <p className="text-xs text-[var(--muted)]">
                                    Apenas peças com status &ldquo;Disponível&rdquo; são exibidas abaixo.
                                </p>
                            </div>
                            <span className="text-xs font-medium text-[var(--accent)]">
                                {availableProducts.length} peça(s) disponível(is)
                            </span>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Buscar peça disponível por código, marca, tipo, cor ou tamanho..."
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-transparent py-2 pl-9 pr-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            />
                        </div>

                        {isLoadingProdutos ? (
                            <div className="flex items-center justify-center py-12 text-sm text-[var(--muted)]">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--accent)]" />
                                Carregando acervo disponível...
                            </div>
                        ) : availableProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-h-[460px] overflow-y-auto pr-1">
                                {availableProducts.map((prod) => {
                                    const isSelected = selectedProducts.some(
                                        (item) => item.id_produto === prod.id_produto
                                    );
                                    const firstFoto = prod.fotos?.[0];
                                    const imgUrl =
                                        (typeof firstFoto === "string"
                                            ? firstFoto
                                            : firstFoto?.url_foto || firstFoto?.caminho_arquivo) ||
                                        prod.foto_principal ||
                                        prod.foto ||
                                        "";

                                    return (
                                        <div
                                            key={prod.id_produto}
                                            onClick={() => toggleSelectProduct(prod)}
                                            className={`cursor-pointer flex items-center gap-3 rounded-[var(--radius)] border p-3 transition-all ${
                                                isSelected
                                                    ? "border-[var(--accent)] bg-[var(--accent-soft)]/40 ring-1 ring-[var(--accent)]"
                                                    : "border-[var(--line)] bg-[var(--background)] hover:border-[var(--muted)]"
                                            }`}
                                        >
                                            <div className="h-14 w-12 shrink-0 overflow-hidden rounded bg-[var(--line)] flex items-center justify-center">
                                                {imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={prod.marca}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ShoppingBag className="h-5 w-5 text-[var(--muted)]" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                                                    {prod.tipo || "Peça"} — {prod.marca}
                                                </p>
                                                <p className="text-xs text-[var(--muted)]">
                                                    #{prod.id_produto} • Tam: {prod.tamanho} • {prod.cor}
                                                </p>
                                                <p className="mt-0.5 text-xs font-semibold text-[var(--foreground)]">
                                                    {new Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }).format(Number(prod.preco_venda || 0))}
                                                </p>
                                            </div>
                                            <div
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                                                    isSelected
                                                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                                        : "border-[var(--muted)] bg-[var(--surface)] text-transparent"
                                                }`}
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-[var(--radius)] border border-dashed border-[var(--muted)] py-10 text-center">
                                <p className="text-sm font-medium text-[var(--foreground)]">
                                    Nenhuma peça disponível encontrada
                                </p>
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Cadastre novas peças em Produtos para poder adicioná-las a um pedido.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUNA DIREITA (1/3): RESUMO DO PEDIDO */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs space-y-5 lg:sticky lg:top-6">
                    <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                        <h2 className="text-base font-medium text-[var(--foreground)]">Resumo da Venda</h2>
                        <span className="rounded-full bg-[var(--background)] px-2.5 py-0.5 text-xs font-medium text-[var(--foreground)] border border-[var(--line)]">
                            {selectedProducts.length} {selectedProducts.length === 1 ? "peça" : "peças"}
                        </span>
                    </div>

                    {selectedProducts.length > 0 ? (
                        <ul className="divide-y divide-[var(--line)] max-h-72 overflow-y-auto">
                            {selectedProducts.map((item) => (
                                <li key={item.id_produto} className="flex items-center justify-between py-2.5 text-sm">
                                    <div className="min-w-0 pr-2">
                                        <p className="truncate font-medium text-[var(--foreground)]">
                                            {item.tipo || "Peça"} {item.marca}
                                        </p>
                                        <p className="text-xs text-[var(--muted)]">
                                            #{item.id_produto} • Tam {item.tamanho}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="font-medium text-[var(--foreground)]">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(Number(item.preco_venda || 0))}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => toggleSelectProduct(item)}
                                            className="rounded p-1 text-[var(--muted)] hover:bg-red-50 hover:text-[var(--danger)]"
                                            title="Remover peça"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-xs text-[var(--muted)]">
                            Clique nas peças disponíveis ao lado para adicioná-las a esta venda.
                        </div>
                    )}

                    <div className="border-t border-[var(--line)] pt-4 space-y-2">
                        <div className="flex items-center justify-between text-base font-semibold text-[var(--foreground)]">
                            <span>Total do Pedido</span>
                            <span className="text-lg text-[var(--accent)]">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    totalOrderValue
                                )}
                            </span>
                        </div>
                        <p className="text-[11px] text-[var(--muted)]">
                            Ao confirmar, as peças selecionadas serão automaticamente marcadas como vendidas no acervo.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || selectedProducts.length === 0}
                        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Registrando Pedido...</span>
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                <span>Confirmar e Registrar Pedido</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* MODAL DE CADASTRO RÁPIDO DE CLIENTE */}
            {isClientModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-[var(--foreground)]">Novo Cliente Rápido</h3>
                                <p className="text-xs text-[var(--muted)]">
                                    Ideal para vendas via Instagram, WhatsApp ou presenciais.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsClientModalOpen(false)}
                                className="rounded p-1 text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {clientError && (
                            <div className="mb-4 flex items-center gap-2 rounded bg-red-50 p-3 text-xs text-[var(--danger)] border border-red-200">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{clientError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateClientQuick} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-[var(--foreground)]">Nome Completo *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Ana Beatriz (@anabeatriz)"
                                    value={newClient.nome}
                                    onChange={(e) => setNewClient((s) => ({ ...s, nome: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--foreground)]">
                                        Telefone / WhatsApp *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="(41) 99999-9999"
                                        value={newClient.telefone}
                                        onChange={(e) => setNewClient((s) => ({ ...s, telefone: e.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--foreground)]">
                                        E-mail (opcional)
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="cliente@email.com"
                                        value={newClient.email}
                                        onChange={(e) => setNewClient((s) => ({ ...s, email: e.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--foreground)]">Cidade</label>
                                    <select
                                        value={newClient.id_cidade}
                                        onChange={(e) => setNewClient((s) => ({ ...s, id_cidade: e.target.value }))}
                                        className={inputClass}
                                    >
                                        {CIDADES_PADRAO.map((c) => (
                                            <option key={c.id_cidade} value={String(c.id_cidade)}>
                                                {c.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--foreground)]">
                                        Endereço de Entrega / Observação
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Rua, Número ou Retirada"
                                        value={newClient.endereco}
                                        onChange={(e) => setNewClient((s) => ({ ...s, endereco: e.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--line)]">
                                <button
                                    type="button"
                                    onClick={() => setIsClientModalOpen(false)}
                                    className="rounded-[var(--radius)] border border-[var(--line)] px-4 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--background)]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingClient}
                                    className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white hover:brightness-110 disabled:opacity-50"
                                >
                                    {isCreatingClient && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                    {isCreatingClient ? "Salvando..." : "Salvar e Selecionar Cliente"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

