"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient, parseApiError } from "@/lib/api/client";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

interface ProductFormData {
    id_fornecedor: string;
    id_tipo: string;
    id_genero: string;
    marca: string;
    tamanho: string;
    cor: string;
    preco_custo: number;
    preco_venda: number;
    disponivel: string;
}

interface FornecedorOption {
    id_usuario: number;
    nome: string;
}

interface ConfigData {
    tipos_produto: { id_tipo: number; nome: string }[];
    generos: { id_genero: number; nome: string }[];
}

export default function EditarProdutoPage({ params }: EditProductPageProps) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [fornecedores, setFornecedores] = useState<FornecedorOption[]>([]);
    const [configData, setConfigData] = useState<ConfigData | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const { register, handleSubmit, reset } = useForm<ProductFormData>({
        defaultValues: {
            id_fornecedor: "",
            id_tipo: "",
            id_genero: "",
            marca: "",
            tamanho: "",
            cor: "",
            preco_custo: 0,
            preco_venda: 0,
            disponivel: "true",
        },
    });

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [prodRes, fornRes, confRes] = await Promise.all([
                    apiClient.get(`/api/admin/produtos/${productId}`).catch(() => apiClient.get(`/api/produtos/${productId}`)),
                    apiClient.get("/api/admin/fornecedores").catch(() => ({ data: [] })),
                    apiClient.get("/api/admin/configuracoes").catch(() => ({ data: null })),
                ]);

                const rawForns = Array.isArray(fornRes.data) ? fornRes.data : fornRes.data?.data || [];
                setFornecedores(
                    rawForns.map((item: Record<string, unknown>) => {
                        const usuario = (item.usuario as Record<string, unknown>) || {};
                        return {
                            id_usuario: Number(item.id_usuario || usuario.id_usuario || item.id),
                            nome: String(item.nome || usuario.nome || `Fornecedor #${item.id_usuario}`),
                        };
                    })
                );

                if (confRes.data) {
                    setConfigData(confRes.data);
                }

                const data = prodRes.data?.data || prodRes.data;
                const tipoObj = (data.tipo_produto || data.tipoProduto) as Record<string, unknown> | undefined;
                const generoObj = data.genero as Record<string, unknown> | undefined;

                reset({
                    id_fornecedor: String(data.id_fornecedor || ""),
                    id_tipo: String(data.id_tipo || tipoObj?.id_tipo || ""),
                    id_genero: String(data.id_genero || generoObj?.id_genero || ""),
                    marca: String(data.marca || ""),
                    tamanho: String(data.tamanho || ""),
                    cor: String(data.cor || ""),
                    preco_custo: Number(data.preco_custo || 0),
                    preco_venda: Number(data.preco_venda || 0),
                    disponivel: data.disponivel === false || data.disponivel === 0 ? "false" : "true",
                });
            } catch (err) {
                const parsed = parseApiError(err);
                setFeedback({
                    type: "error",
                    message: parsed.message || "Não foi possível carregar os dados desta peça.",
                });
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [productId, reset]);

    const onSubmit = async (data: ProductFormData) => {
        setIsSaving(true);
        setFeedback(null);

        try {
            await apiClient.put(`/api/admin/produtos/${productId}`, {
                id_fornecedor: data.id_fornecedor ? Number(data.id_fornecedor) : undefined,
                id_tipo: data.id_tipo ? Number(data.id_tipo) : undefined,
                id_genero: data.id_genero ? Number(data.id_genero) : undefined,
                marca: data.marca,
                tamanho: data.tamanho,
                cor: data.cor,
                preco_custo: Number(data.preco_custo),
                preco_venda: Number(data.preco_venda),
                disponivel: data.disponivel === "true",
            });

            await queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });

            setFeedback({
                type: "success",
                message: "Produto atualizado com sucesso!",
            });

            setTimeout(() => {
                router.push("/admin/produtos");
            }, 1000);
        } catch (err) {
            const parsed = parseApiError(err);
            setFeedback({
                type: "error",
                message: parsed.message || "Erro ao atualizar produto. Verifique os dados e tente novamente.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const tiposProduto = configData?.tipos_produto || [
        { id_tipo: 1, nome: "Camiseta/Blusa" },
        { id_tipo: 2, nome: "Calça" },
        { id_tipo: 3, nome: "Vestido" },
        { id_tipo: 4, nome: "Jaqueta/Casaco" },
        { id_tipo: 5, nome: "Bermuda/Shorts" },
        { id_tipo: 6, nome: "Calçado" },
        { id_tipo: 7, nome: "Acessório" },
    ];

    const generosList = configData?.generos || [
        { id_genero: 1, nome: "Feminino" },
        { id_genero: 2, nome: "Masculino" },
        { id_genero: 3, nome: "Unissex" },
        { id_genero: 4, nome: "Infantil" },
    ];

    const inputClass =
        "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--muted)]">
                <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                <p className="text-sm">Carregando dados da peça...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div>
                <Link
                    href="/admin/produtos"
                    className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para lista de produtos
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                            Editar Peça #{productId}
                        </h1>
                        <p className="text-sm text-[var(--muted)]">
                            Atualize os dados cadastrais, precificação e disponibilidade.
                        </p>
                    </div>
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                    <h3 className="font-medium text-base text-[var(--foreground)]">Identificação da Peça</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]">Fornecedor</label>
                            <select className={inputClass} {...register("id_fornecedor")}>
                                <option value="">Selecione um fornecedor...</option>
                                {fornecedores.map((f) => (
                                    <option key={f.id_usuario} value={String(f.id_usuario)}>
                                        {f.nome} (#{f.id_usuario})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Marca</label>
                            <input type="text" className={inputClass} {...register("marca", { required: true })} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Categoria / Tipo de Peça</label>
                            <select className={inputClass} {...register("id_tipo", { required: true })}>
                                <option value="">Selecione...</option>
                                {tiposProduto.map((t) => (
                                    <option key={t.id_tipo} value={String(t.id_tipo)}>
                                        {t.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Gênero</label>
                            <select className={inputClass} {...register("id_genero", { required: true })}>
                                <option value="">Selecione...</option>
                                {generosList.map((g) => (
                                    <option key={g.id_genero} value={String(g.id_genero)}>
                                        {g.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Tamanho</label>
                            <input type="text" className={inputClass} {...register("tamanho", { required: true })} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Cor Predominante</label>
                            <input type="text" className={inputClass} {...register("cor")} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Disponibilidade</label>
                            <select className={inputClass} {...register("disponivel")}>
                                <option value="true">Disponível no acervo</option>
                                <option value="false">Vendido / Indisponível</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                    <h3 className="font-medium text-base text-[var(--foreground)]">Precificação</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Preço de Custo (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className={inputClass}
                                {...register("preco_custo", { valueAsNumber: true })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Preço de Venda (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className={inputClass}
                                {...register("preco_venda", { required: true, valueAsNumber: true })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href="/admin/produtos"
                        className="rounded-[var(--radius)] border border-[var(--line)] px-5 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-neutral-50"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-6 py-2 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </form>
        </div>
    );
}

