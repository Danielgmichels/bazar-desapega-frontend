"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    UploadCloud,
    Trash2,
    Star,
    ChevronLeft,
    ChevronRight,
    ImageIcon
} from "lucide-react";
import { apiClient, parseApiError } from "@/lib/api/client";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

interface ProductFormData {
    id_fornecedor: string;
    id_tipo: string;
    id_genero: string;
    titulo: string;
    descricao: string;
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

interface PhotoItem {
    id?: number;
    url: string;
    ordem: number;
    is_principal: boolean;
    file?: File;
    isNew?: boolean;
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

    // Gestão de fotos da peça
    const [fotos, setFotos] = useState<PhotoItem[]>([]);
    const [fotosParaRemover, setFotosParaRemover] = useState<number[]>([]);

    const { register, handleSubmit, reset } = useForm<ProductFormData>({
        defaultValues: {
            id_fornecedor: "",
            id_tipo: "",
            id_genero: "",
            titulo: "",
            descricao: "",
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
                    titulo: String(data.titulo || ""),
                    descricao: String(data.descricao || ""),
                    marca: String(data.marca || ""),
                    tamanho: String(data.tamanho || ""),
                    cor: String(data.cor || ""),
                    preco_custo: Number(data.preco_custo || 0),
                    preco_venda: Number(data.preco_venda || 0),
                    disponivel: data.disponivel === false || data.disponivel === 0 ? "false" : "true",
                });

                // Carrega fotos existentes do produto
                const serverFotos = Array.isArray(data.fotos) ? data.fotos : [];
                const loadedFotos: PhotoItem[] = serverFotos.map((f: any, idx: number) => ({
                    id: f.id_foto || f.id,
                    url: f.url_foto || f.caminho_arquivo,
                    ordem: typeof f.ordem === "number" ? f.ordem : idx,
                    is_principal: f.is_principal ?? (idx === 0),
                    isNew: false,
                }));

                // Se não vier fotos na galeria mas tiver foto_principal
                if (loadedFotos.length === 0 && data.foto_principal) {
                    loadedFotos.push({
                        id: undefined,
                        url: data.foto_principal,
                        ordem: 0,
                        is_principal: true,
                        isNew: false,
                    });
                }

                // Garante ordenação contígua
                loadedFotos.sort((a, b) => a.ordem - b.ordem);
                setFotos(loadedFotos);
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

    // 1. Adicionar novas fotos
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newSelected = Array.from(e.target.files).map((file, i) => ({
                file,
                url: URL.createObjectURL(file),
                isNew: true,
                ordem: fotos.length + i,
                is_principal: fotos.length === 0 && i === 0,
            }));
            setFotos((prev) => [...prev, ...newSelected]);
        }
        e.target.value = "";
    };

    // 2. Definir como foto principal
    const handleSetPrincipal = (index: number) => {
        setFotos((prev) => {
            const target = prev[index];
            if (!target) return prev;
            const remaining = prev.filter((_, i) => i !== index);
            const reordered = [target, ...remaining].map((f, i) => ({
                ...f,
                ordem: i,
                is_principal: i === 0,
            }));
            return reordered;
        });
    };

    // 3. Mover para a esquerda (ordem anterior)
    const handleMoveLeft = (index: number) => {
        if (index <= 0) return;
        setFotos((prev) => {
            const copy = [...prev];
            const temp = copy[index - 1];
            copy[index - 1] = copy[index];
            copy[index] = temp;
            return copy.map((f, i) => ({
                ...f,
                ordem: i,
                is_principal: i === 0,
            }));
        });
    };

    // 4. Mover para a direita (próxima ordem)
    const handleMoveRight = (index: number) => {
        if (index >= fotos.length - 1) return;
        setFotos((prev) => {
            const copy = [...prev];
            const temp = copy[index + 1];
            copy[index + 1] = copy[index];
            copy[index] = temp;
            return copy.map((f, i) => ({
                ...f,
                ordem: i,
                is_principal: i === 0,
            }));
        });
    };

    // 5. Excluir foto
    const handleRemoveFoto = (indexToRemove: number) => {
        setFotos((prev) => {
            const target = prev[indexToRemove];
            if (target && target.id && !target.isNew) {
                setFotosParaRemover((rem) => [...rem, target.id!]);
            }
            const updated = prev.filter((_, i) => i !== indexToRemove);
            return updated.map((f, i) => ({
                ...f,
                ordem: i,
                is_principal: i === 0,
            }));
        });
    };

    const onSubmit = async (data: ProductFormData) => {
        setIsSaving(true);
        setFeedback(null);

        if (fotos.length === 0) {
            setFeedback({
                type: "error",
                message: "A peça deve ter pelo menos uma foto cadastrada.",
            });
            setIsSaving(false);
            return;
        }

        try {
            const hasNewFiles = fotos.some((f) => f.isNew && f.file);

            if (hasNewFiles) {
                const formData = new FormData();
                formData.append("_method", "PUT");
                if (data.id_fornecedor) formData.append("id_fornecedor", data.id_fornecedor);
                if (data.id_tipo) formData.append("id_tipo", data.id_tipo);
                if (data.id_genero) formData.append("id_genero", data.id_genero);
                formData.append("marca", data.marca);
                if (data.titulo) formData.append("titulo", data.titulo);
                if (data.descricao) formData.append("descricao", data.descricao);
                formData.append("tamanho", data.tamanho);
                formData.append("cor", data.cor);
                formData.append("preco_custo", String(data.preco_custo));
                formData.append("preco_venda", String(data.preco_venda));
                formData.append("disponivel", data.disponivel);

                // IDs a remover
                fotosParaRemover.forEach((id) => {
                    formData.append("fotos_remover[]", String(id));
                });

                // Ordem das fotos existentes mantidas
                const existentesIds = fotos.filter((f) => !f.isNew && f.id).map((f) => f.id!);
                existentesIds.forEach((id) => {
                    formData.append("ordem_fotos[]", String(id));
                });

                // Foto principal caso seja uma foto existente
                const principalItem = fotos[0];
                if (principalItem && principalItem.id && !principalItem.isNew) {
                    formData.append("id_foto_principal", String(principalItem.id));
                }

                // Novas fotos adicionadas
                fotos.filter((f) => f.isNew && f.file).forEach((f) => {
                    formData.append("novas_fotos[]", f.file!);
                });

                await apiClient.post(`/api/admin/produtos/${productId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                // Requisição JSON direta
                await apiClient.put(`/api/admin/produtos/${productId}`, {
                    id_fornecedor: data.id_fornecedor ? Number(data.id_fornecedor) : undefined,
                    id_tipo: data.id_tipo ? Number(data.id_tipo) : undefined,
                    id_genero: data.id_genero ? Number(data.id_genero) : undefined,
                    marca: data.marca,
                    titulo: data.titulo,
                    descricao: data.descricao,
                    tamanho: data.tamanho,
                    cor: data.cor,
                    preco_custo: Number(data.preco_custo),
                    preco_venda: Number(data.preco_venda),
                    disponivel: data.disponivel === "true",
                    fotos_remover: fotosParaRemover,
                    ordem_fotos: fotos.filter((f) => !f.isNew && f.id).map((f) => f.id!),
                    id_foto_principal: fotos[0]?.id,
                });
            }

            await queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-dashboard-produtos"] });

            setFeedback({
                type: "success",
                message: "Produto e galeria de fotos atualizados com sucesso!",
            });

            setTimeout(() => {
                router.push("/admin/produtos");
            }, 1200);
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
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
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
                            Atualize informações cadastrais, precificação e faça a gestão completa das fotos.
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

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* COLUNA ESQUERDA: DADOS DA PEÇA E PRECIFICAÇÃO (2/3) */}
                <div className="lg:col-span-2 space-y-6">
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

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-sm font-medium text-[var(--foreground)]">Título da Peça (Vitrine)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Jaqueta Jeans Vintage 90s"
                                    className={inputClass}
                                    {...register("titulo")}
                                />
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-sm font-medium text-[var(--foreground)]">Descrição e Detalhes da Peça</label>
                                <textarea
                                    rows={3}
                                    placeholder="Descreva o estado de conservação, detalhes do tecido, medidas, etc."
                                    className={inputClass}
                                    {...register("descricao")}
                                />
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
                </div>

                {/* COLUNA DIREITA: GESTÃO COMPLETA DE FOTOS (1/3) */}
                <div className="space-y-6">
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-base text-[var(--foreground)]">Galeria de Fotos</h3>
                            <span className="text-xs text-[var(--muted)]">{fotos.length} foto(s)</span>
                        </div>
                        <p className="text-xs text-[var(--muted)]">
                            A primeira foto (#1) é a foto principal exibida na vitrine. Use as setas para reordenar ou clique na estrela para torná-la principal.
                        </p>

                        {/* Botão de Upload de Novas Fotos */}
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius)] border-2 border-dashed border-[var(--muted)] bg-[var(--background)] py-5 px-3 text-center transition-colors hover:border-[var(--accent)] hover:bg-neutral-50">
                            <UploadCloud className="mb-1.5 h-6 w-6 text-[var(--muted)]" />
                            <span className="text-xs font-medium text-[var(--foreground)]">Adicionar Fotos</span>
                            <span className="mt-0.5 text-[10px] text-[var(--muted)]">PNG ou JPG até 10MB</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>

                        {/* Grid de Fotos com Controles */}
                        {fotos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                {fotos.map((item, index) => {
                                    const isPrincipal = index === 0;
                                    return (
                                        <div
                                            key={item.id ? `server-${item.id}` : `new-${index}-${item.url}`}
                                            className={`relative group aspect-square rounded-[var(--radius)] overflow-hidden border-2 bg-neutral-100 flex flex-col justify-between ${
                                                isPrincipal ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--line)]"
                                            }`}
                                        >
                                            <img
                                                src={item.url}
                                                alt={`Foto ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />

                                            {/* Badges superiores: Número da Ordem e Principal */}
                                            <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                                                <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                    #{index + 1}
                                                </span>
                                                {isPrincipal ? (
                                                    <span className="rounded bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                                                        Principal
                                                    </span>
                                                ) : item.isNew ? (
                                                    <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                                                        Nova
                                                    </span>
                                                ) : null}
                                            </div>

                                            {/* Barra de Controles (Sempre acessível no hover ou mobile) */}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                                                <div className="flex items-center gap-1">
                                                    {/* Mover para esquerda */}
                                                    <button
                                                        type="button"
                                                        disabled={index === 0}
                                                        onClick={() => handleMoveLeft(index)}
                                                        className="rounded p-1 bg-white/90 text-neutral-800 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                        title="Mover para trás"
                                                    >
                                                        <ChevronLeft className="h-3.5 w-3.5" />
                                                    </button>

                                                    {/* Mover para direita */}
                                                    <button
                                                        type="button"
                                                        disabled={index === fotos.length - 1}
                                                        onClick={() => handleMoveRight(index)}
                                                        className="rounded p-1 bg-white/90 text-neutral-800 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                        title="Mover para frente"
                                                    >
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {/* Definir como Principal */}
                                                    {!isPrincipal && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetPrincipal(index)}
                                                            className="rounded p-1 bg-white/90 text-amber-600 hover:bg-white transition-all"
                                                            title="Definir como foto principal"
                                                        >
                                                            <Star className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Remover Foto */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFoto(index)}
                                                        className="rounded p-1 bg-white/90 text-red-600 hover:bg-white transition-all"
                                                        title="Excluir esta foto"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[var(--line)] rounded-[var(--radius)] text-center text-[var(--muted)]">
                                <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                <p className="text-xs">Nenhuma foto para esta peça.</p>
                                <p className="text-[11px] mt-1 text-amber-600">Adicione ao menos 1 foto para salvar.</p>
                            </div>
                        )}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-2.5">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full flex items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] py-2.5 px-4 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isSaving ? "Salvando Alterações..." : "Salvar Alterações"}
                        </button>
                        <Link
                            href="/admin/produtos"
                            className="w-full flex items-center justify-center rounded-[var(--radius)] border border-[var(--line)] py-2 px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-neutral-50 text-center"
                        >
                            Cancelar
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
