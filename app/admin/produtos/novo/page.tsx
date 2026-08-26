"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";

// 1. Schema de validação
const productSchema = z.object({
    fornecedor: z.string().min(1, "Selecione um fornecedor"),
    tipo: z.string().min(1, "O tipo é obrigatório"),
    genero: z.string().min(1, "O gênero é obrigatório"),
    dataEntrada: z.string().min(1, "A data de entrada é obrigatória"),
    marca: z.string().min(1, "A marca é obrigatória"),
    tamanho: z.string().min(1, "O tamanho é obrigatório"),
    cor: z.string().min(1, "A cor é obrigatória"),
    precoCusto: z.coerce.number().min(0, "O preço não pode ser negativo"),
    precoVenda: z.coerce.number().min(0.01, "O preço de venda deve ser maior que zero"),
});

type ProductForm = z.infer<typeof productSchema>;

export default function NovoProdutoPage() {
    const [fotos, setFotos] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFotos((prev) => [...prev, ...selectedFiles]);
        }
    };

    const onSubmit = async (data: ProductForm) => {
        // A especificação exige o envio como multipart/form-data
        const formData = new FormData();

        // Adicionando os campos de texto
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        // Adicionando os arquivos binários
        fotos.forEach((foto) => {
            formData.append("fotos[]", foto);
        });

        console.log("Enviando requisição multipart/form-data...");
        // Apenas para visualizar no console (FormData não é visível num console.log normal)
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert("Produto cadastrado com sucesso! (Simulação)");

        reset();
        setFotos([]);
    };

    // Classe padrão para os inputs (a mesma que ajustamos antes)
    const inputClass = "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/admin/produtos" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para produtos
                    </Link>
                    <h1 className="mt-2 text-2xl font-medium tracking-tight text-[var(--foreground)]">Novo Produto</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

                {/* COLUNA ESQUERDA: DADOS DA PEÇA (Ocupa 2/3 no Desktop) */}
                <div className="grid grid-cols-1 gap-6 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm sm:grid-cols-2 lg:col-span-2">

                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-[var(--foreground)]">Fornecedor</label>
                        <select className={inputClass} {...register("fornecedor")}>
                            <option value="">Selecione...</option>
                            <option value="1">Fornecedor A</option>
                            <option value="2">Fornecedor B</option>
                        </select>
                        {errors.fornecedor && <p className="text-xs text-[var(--danger)]">{errors.fornecedor.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]">Tipo de Peça</label>
                        <input type="text" placeholder="Ex: Casaco de Lã" className={inputClass} {...register("tipo")} />
                        {errors.tipo && <p className="text-xs text-[var(--danger)]">{errors.tipo.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]">Gênero</label>
                        <select className={inputClass} {...register("genero")}>
                            <option value="">Selecione...</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Unissex">Unissex</option>
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

                    {/* Bloco de Fotos */}
                    <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="text-base font-medium text-[var(--foreground)]">Galeria de Fotos</h2>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius)] border-2 border-dashed border-[var(--muted)] bg-[var(--background)] py-8 transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">
                            <UploadCloud className="mb-2 h-8 w-8 text-[var(--muted)]" />
                            <span className="text-sm font-medium text-[var(--foreground)]">Clique para enviar fotos</span>
                            <span className="mt-1 text-xs text-[var(--muted)]">PNG, JPG até 5MB</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>

                        {/* Preview simples dos arquivos selecionados */}
                        {fotos.length > 0 && (
                            <div className="mt-2 flex flex-col gap-2">
                                {fotos.map((foto, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm text-[var(--muted)]">
                                        <span className="truncate">{foto.name}</span>
                                        <button type="button" onClick={() => setFotos(fotos.filter((_, i) => i !== index))} className="text-[var(--danger)] hover:underline">
                                            Remover
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bloco Financeiro e Ação */}
                    <div className="flex flex-col gap-6 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
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
                            className="mt-4 flex w-full items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            {isSubmitting ? "Cadastrando..." : "Cadastrar Produto"}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}