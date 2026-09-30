"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    UploadCloud,
    Trash2,
    Star,
    AlertCircle,
    Loader2,
    CheckCircle2,
    UserPlus,
    X,
} from "lucide-react";
import { api, parseApiError } from "@/lib/api/client";

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

const productSchema = z.object({
    fornecedor: z.string().min(1, "Selecione um fornecedor"),
    tipo: z.string().min(1, "O tipo é obrigatório"),
    genero: z.string().min(1, "O gênero é obrigatório"),
    dataEntrada: z.string().min(1, "A data de entrada é obrigatória"),
    marca: z.string().min(1, "A marca é obrigatória"),
    tamanho: z.string().min(1, "O tamanho é obrigatório"),
    cor: z.string().min(1, "A cor é obrigatória"),
    precoCusto: z.coerce.number().min(0, "O preço de custo não pode ser negativo"),
    precoVenda: z.coerce.number().min(0.01, "O preço de venda deve ser maior que zero"),
});

type ProductForm = z.infer<typeof productSchema>;

interface UploadedFilePreview {
    file: File;
    previewUrl: string;
}

interface FornecedorOption {
    id_usuario: number;
    nome: string;
    email?: string;
}

interface ConfigData {
    tipos_produto: { id_tipo: number; nome: string }[];
    generos: { id_genero: number; nome: string }[];
}

export default function NovoProdutoPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [fotos, setFotos] = useState<UploadedFilePreview[]>([]);
    const [fotoPrincipalIndex, setFotoPrincipalIndex] = useState<number>(0);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Estado do Modal de Novo Fornecedor Rápido
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isCreatingSupplier, setIsCreatingSupplier] = useState(false);
    const [supplierError, setSupplierError] = useState<string | null>(null);
    const [newSupplier, setNewSupplier] = useState({
        nome: "",
        email: "",
        telefone: "",
        id_cidade: "4007",
        endereco: "",
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            dataEntrada: new Date().toISOString().split("T")[0],
        },
    });

    // Busca fornecedores reais da API
    const { data: fornecedores = [], isLoading: isLoadingFornecedores } = useQuery<FornecedorOption[]>({
        queryKey: ["admin-fornecedores"],
        queryFn: async () => {
            const res = await api.get("/api/admin/fornecedores");
            const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
            return raw.map((item: Record<string, unknown>) => {
                const usuario = (item.usuario as Record<string, unknown>) || {};
                return {
                    id_usuario: Number(item.id_usuario || usuario.id_usuario || item.id),
                    nome: String(item.nome || usuario.nome || `Fornecedor #${item.id_usuario}`),
                    email: String(item.email || usuario.email || ""),
                };
            });
        },
    });

    // Busca categorias e gêneros reais da API
    const { data: configData } = useQuery<ConfigData>({
        queryKey: ["admin-configuracoes"],
        queryFn: async () => {
            const res = await api.get("/api/admin/configuracoes");
            return res.data;
        },
    });

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selected = Array.from(e.target.files).map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
            }));
            setFotos((prev) => [...prev, ...selected]);
        }
    };

    const handleRemoveFoto = (indexToRemove: number) => {
        setFotos((prev) => {
            const updated = prev.filter((_, i) => i !== indexToRemove);
            if (fotoPrincipalIndex >= updated.length) {
                setFotoPrincipalIndex(Math.max(0, updated.length - 1));
            }
            return updated;
        });
    };

    // Criação rápida de fornecedor sem sair da página de produto
    const handleCreateSupplierQuick = async (e: React.FormEvent) => {
        e.preventDefault();
        setSupplierError(null);

        if (!newSupplier.nome.trim() || !newSupplier.email.trim() || !newSupplier.telefone.trim()) {
            setSupplierError("Preencha nome, e-mail e telefone do fornecedor.");
            return;
        }

        setIsCreatingSupplier(true);
        try {
            const res = await api.post("/api/admin/fornecedores", {
                nome: newSupplier.nome.trim(),
                email: newSupplier.email.trim(),
                telefone: newSupplier.telefone.trim(),
                id_cidade: Number(newSupplier.id_cidade),
                endereco: newSupplier.endereco.trim() || "Endereço Comercial",
            });

            const createdId = String(res.data?.id_usuario || res.data?.data?.id_usuario || "");
            await queryClient.invalidateQueries({ queryKey: ["admin-fornecedores"] });

            if (createdId) {
                setValue("fornecedor", createdId, { shouldValidate: true });
            }

            setIsSupplierModalOpen(false);
            setNewSupplier({
                nome: "",
                email: "",
                telefone: "",
                id_cidade: "4007",
                endereco: "",
            });
        } catch (err) {
            const parsed = parseApiError(err);
            setSupplierError(parsed.message || "Não foi possível cadastrar o fornecedor.");
        } finally {
            setIsCreatingSupplier(false);
        }
    };

    const onSubmit = async (data: ProductForm) => {
        setApiError(null);
        setSuccessMessage(null);

        if (fotos.length === 0) {
            setApiError("Adicione pelo menos 1 foto da peça para cadastrar o produto.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("id_fornecedor", data.fornecedor);
            formData.append("id_tipo", data.tipo);
            formData.append("tipo", data.tipo);
            formData.append("id_genero", data.genero);
            formData.append("genero", data.genero);
            formData.append("data_entrada", data.dataEntrada);
            formData.append("marca", data.marca);
            formData.append("tamanho", data.tamanho);
            formData.append("cor", data.cor);
            formData.append("preco_custo", data.precoCusto.toString());
            formData.append("preco_venda", data.precoVenda.toString());
            formData.append("foto_principal_index", fotoPrincipalIndex.toString());

            // Envia foto_principal e fotos_secundarias[] conforme esperado pelo controller Laravel
            const mainFoto = fotos[fotoPrincipalIndex] || fotos[0];
            if (mainFoto) {
                formData.append("foto_principal", mainFoto.file);
            }

            fotos.forEach((item, idx) => {
                formData.append("fotos[]", item.file);
                if (idx !== fotoPrincipalIndex) {
                    formData.append("fotos_secundarias[]", item.file);
                }
            });

            await api.post("/api/admin/produtos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            await queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });

            setSuccessMessage("Produto cadastrado com sucesso no acervo!");
            reset();
            setFotos([]);

            setTimeout(() => {
                router.push("/admin/produtos");
            }, 1000);
        } catch (error) {
            const parsed = parseApiError(error);
            setApiError(parsed.message || "Erro ao cadastrar o produto no servidor.");
        }
    };

    const inputClass =
        "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link
                        href="/admin/produtos"
                        className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para produtos
                    </Link>
                    <h1 className="mt-2 text-2xl font-medium tracking-tight text-[var(--foreground)]">
                        Novo Produto
                    </h1>
                </div>
            </div>

            {apiError && (
                <div className="mb-6 flex items-start gap-2.5 rounded-[var(--radius)] bg-red-50 p-4 text-sm text-[var(--danger)] border border-red-200">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 flex items-start gap-2.5 rounded-[var(--radius)] bg-green-50 p-4 text-sm text-[var(--success)] border border-green-200">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                {/* COLUNA ESQUERDA: DADOS DA PEÇA (Ocupa 2/3 no Desktop) */}
                <div className="grid grid-cols-1 gap-6 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs sm:grid-cols-2 lg:col-span-2">
                    <div className="space-y-1.5 sm:col-span-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--foreground)]">Fornecedor</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setSupplierError(null);
                                    setIsSupplierModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                            >
                                <UserPlus className="h-3.5 w-3.5" />
                                + Cadastrar novo fornecedor
                            </button>
                        </div>
                        <select className={inputClass} {...register("fornecedor")} disabled={isLoadingFornecedores}>
                            <option value="">
                                {isLoadingFornecedores
                                    ? "Carregando fornecedores..."
                                    : fornecedores.length === 0
                                    ? "Nenhum fornecedor cadastrado (clique em + Cadastrar novo fornecedor)"
                                    : "Selecione um fornecedor..."}
                            </option>
                            {fornecedores.map((f) => (
                                <option key={f.id_usuario} value={String(f.id_usuario)}>
                                    {f.nome} (#{f.id_usuario})
                                </option>
                            ))}
                        </select>
                        {errors.fornecedor && <p className="text-xs text-[var(--danger)]">{errors.fornecedor.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]">Categoria / Tipo de Peça</label>
                        <select className={inputClass} {...register("tipo")}>
                            <option value="">Selecione a categoria...</option>
                            {tiposProduto.map((t) => (
                                <option key={t.id_tipo} value={String(t.id_tipo)}>
                                    {t.nome}
                                </option>
                            ))}
                        </select>
                        {errors.tipo && <p className="text-xs text-[var(--danger)]">{errors.tipo.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]">Gênero</label>
                        <select className={inputClass} {...register("genero")}>
                            <option value="">Selecione...</option>
                            {generosList.map((g) => (
                                <option key={g.id_genero} value={String(g.id_genero)}>
                                    {g.nome}
                                </option>
                            ))}
                        </select>
                        {errors.genero && <p className="text-xs text-[var(--danger)]">{errors.genero.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]">Marca</label>
                        <input type="text" placeholder="Ex: Zara" className={inputClass} {...register("marca")} />
                        {errors.marca && <p className="text-xs text-[var(--danger)]">{errors.marca.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]">Tamanho</label>
                        <input type="text" placeholder="Ex: M ou 40" className={inputClass} {...register("tamanho")} />
                        {errors.tamanho && <p className="text-xs text-[var(--danger)]">{errors.tamanho.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]">Cor</label>
                        <input type="text" placeholder="Ex: Caramelo" className={inputClass} {...register("cor")} />
                        {errors.cor && <p className="text-xs text-[var(--danger)]">{errors.cor.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]">Data de Entrada</label>
                        <input type="date" className={inputClass} {...register("dataEntrada")} />
                        {errors.dataEntrada && <p className="text-xs text-[var(--danger)]">{errors.dataEntrada.message}</p>}
                    </div>
                </div>

                {/* COLUNA DIREITA: FOTOS E FINANCEIRO (Ocupa 1/3 no Desktop) */}
                <div className="flex flex-col gap-8 lg:col-span-1">
                    {/* Bloco de Fotos com Preview e Seleção de Principal */}
                    <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-medium text-[var(--foreground)]">Galeria de Fotos</h2>
                            <span className="text-xs text-[var(--muted)]">{fotos.length} selecionada(s)</span>
                        </div>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius)] border-2 border-dashed border-[var(--muted)] bg-[var(--background)] py-6 px-4 text-center transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">
                            <UploadCloud className="mb-2 h-7 w-7 text-[var(--muted)]" />
                            <span className="text-sm font-medium text-[var(--foreground)]">Clique para enviar fotos</span>
                            <span className="mt-1 text-xs text-[var(--muted)]">PNG ou JPG até 5MB</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>

                        {/* Grade de Previews com Foto Principal e Remoção */}
                        {fotos.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {fotos.map((item, index) => {
                                    const isPrincipal = fotoPrincipalIndex === index;
                                    return (
                                        <div
                                            key={index}
                                            className={`relative group aspect-square rounded-[calc(var(--radius)-4px)] overflow-hidden border-2 bg-[var(--line)] ${
                                                isPrincipal ? "border-[var(--accent)]" : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={item.previewUrl}
                                                alt={`Preview ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />

                                            {/* Badge de Foto Principal */}
                                            {isPrincipal && (
                                                <span className="absolute top-1 left-1 rounded bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                    Principal
                                                </span>
                                            )}

                                            {/* Controles de Foto no Hover */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                {!isPrincipal && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFotoPrincipalIndex(index)}
                                                        className="rounded p-1 bg-white text-[var(--accent)] hover:bg-neutral-100"
                                                        title="Definir como foto principal"
                                                    >
                                                        <Star className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFoto(index)}
                                                    className="rounded p-1 bg-white text-[var(--danger)] hover:bg-neutral-100"
                                                    title="Remover foto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Bloco Financeiro e Ação */}
                    <div className="flex flex-col gap-5 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs">
                        <h2 className="text-base font-medium text-[var(--foreground)]">Financeiro</h2>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Preço de Custo (R$)</label>
                            <input type="number" step="0.01" className={inputClass} {...register("precoCusto")} />
                            {errors.precoCusto && <p className="text-xs text-[var(--danger)]">{errors.precoCusto.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Preço de Venda (R$)</label>
                            <input type="number" step="0.01" className={inputClass} {...register("precoVenda")} />
                            {errors.precoVenda && <p className="text-xs text-[var(--danger)]">{errors.precoVenda.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Cadastrando peça...</span>
                                </>
                            ) : (
                                "Cadastrar Produto"
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* MODAL DE CADASTRO RÁPIDO DE FORNECEDOR */}
            {isSupplierModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-[var(--foreground)]">Novo Fornecedor</h3>
                                <p className="text-xs text-[var(--muted)]">
                                    Cadastre o fornecedor rapidamente sem perder o preenchimento da peça.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSupplierModalOpen(false)}
                                className="rounded p-1 text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {supplierError && (
                            <div className="mb-4 flex items-center gap-2 rounded bg-red-50 p-3 text-xs text-[var(--danger)] border border-red-200">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{supplierError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateSupplierQuick} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-[var(--foreground)]">Nome ou Apelido *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Maria Clara Desapegos"
                                    value={newSupplier.nome}
                                    onChange={(e) => setNewSupplier((s) => ({ ...s, nome: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--foreground)]">E-mail *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="fornecedor@email.com"
                                        value={newSupplier.email}
                                        onChange={(e) => setNewSupplier((s) => ({ ...s, email: e.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--foreground)]">Telefone / WhatsApp *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="(41) 99999-9999"
                                        value={newSupplier.telefone}
                                        onChange={(e) => setNewSupplier((s) => ({ ...s, telefone: e.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--foreground)]">Cidade</label>
                                    <select
                                        value={newSupplier.id_cidade}
                                        onChange={(e) => setNewSupplier((s) => ({ ...s, id_cidade: e.target.value }))}
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
                                    <label className="text-xs font-medium text-[var(--foreground)]">Endereço</label>
                                    <input
                                        type="text"
                                        placeholder="Rua, Número - Bairro"
                                        value={newSupplier.endereco}
                                        onChange={(e) => setNewSupplier((s) => ({ ...s, endereco: e.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--line)]">
                                <button
                                    type="button"
                                    onClick={() => setIsSupplierModalOpen(false)}
                                    className="rounded-[var(--radius)] border border-[var(--line)] px-4 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--background)]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingSupplier}
                                    className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white hover:brightness-110 disabled:opacity-50"
                                >
                                    {isCreatingSupplier && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                    {isCreatingSupplier ? "Salvando..." : "Salvar e Selecionar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
