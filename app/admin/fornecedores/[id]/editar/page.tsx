"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient, parseApiError } from "@/lib/api/client";

const CIDADES_DISPONIVEIS = [
    { id: 4007, nome: "Curitiba - PR" },
    { id: 3832, nome: "São Paulo - SP" },
    { id: 3243, nome: "Rio de Janeiro - RJ" },
    { id: 2310, nome: "Belo Horizonte - MG" },
    { id: 4932, nome: "Porto Alegre - RS" },
    { id: 4401, nome: "Florianópolis - SC" },
    { id: 5570, nome: "Brasília - DF" },
    { id: 4105, nome: "Londrina - PR" },
    { id: 4123, nome: "Maringá - PR" },
];

const fornecedorSchema = z.object({
    nome: z.string().min(2, "O nome do fornecedor é obrigatório"),
    email: z.string().email("Digite um e-mail válido"),
    telefone: z.string().optional(),
    id_cidade: z.string().optional(),
    endereco: z.string().optional(),
});

type FornecedorForm = z.infer<typeof fornecedorSchema>;

export default function EditarFornecedorPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FornecedorForm>({
        resolver: zodResolver(fornecedorSchema),
    });

    useEffect(() => {
        const fetchFornecedor = async () => {
            try {
                const res = await apiClient.get(`/api/admin/fornecedores/${params.id}`);
                const data = res.data?.data || res.data;
                reset({
                    nome: data.nome || "",
                    email: data.email || "",
                    telefone: data.telefone || "",
                    id_cidade: String(data.id_cidade || "4007"),
                    endereco: data.endereco || "",
                });
            } catch {
                setFeedback({ type: "error", text: "Não foi possível carregar os dados do fornecedor." });
            } finally {
                setIsLoading(false);
            }
        };

        fetchFornecedor();
    }, [params.id, reset]);

    const onSubmit = async (data: FornecedorForm) => {
        setFeedback(null);
        try {
            await apiClient.put(`/api/admin/fornecedores/${params.id}`, {
                nome: data.nome.trim(),
                email: data.email.trim(),
                telefone: data.telefone?.trim() || null,
                id_cidade: data.id_cidade ? Number(data.id_cidade) : 4007,
                endereco: data.endereco?.trim() || null,
            });

            queryClient.invalidateQueries({ queryKey: ["admin-fornecedores"] });
            setFeedback({ type: "success", text: "Fornecedor atualizado com sucesso!" });

            setTimeout(() => {
                router.push("/admin/fornecedores");
            }, 1000);
        } catch (err) {
            const parsed = parseApiError(err);
            setFeedback({ type: "error", text: parsed.message || "Erro ao atualizar fornecedor." });
        }
    };

    const inputClass =
        "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    if (isLoading) {
        return (
            <div className="flex flex-col h-64 items-center justify-center text-[var(--muted)]">
                <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--accent)]" />
                <p className="text-sm">Carregando dados do fornecedor...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link
                        href="/admin/fornecedores"
                        className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para fornecedores
                    </Link>
                    <h1 className="mt-2 text-2xl font-medium tracking-tight text-[var(--foreground)] flex items-center gap-2">
                        <Edit className="h-6 w-6 text-[var(--muted)]" />
                        Editar Fornecedor #{params.id}
                    </h1>
                </div>
            </div>

            {feedback && (
                <div
                    className={`mb-6 flex items-center gap-2 rounded-[var(--radius)] p-4 text-sm ${
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
                    <span>{feedback.text}</span>
                </div>
            )}

            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]">Nome / Empresa</label>
                            <input type="text" className={inputClass} {...register("nome")} />
                            {errors.nome && <p className="text-xs text-[var(--danger)]">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">E-mail</label>
                            <input type="email" className={inputClass} {...register("email")} />
                            {errors.email && <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Telefone</label>
                            <input type="tel" className={inputClass} {...register("telefone")} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Cidade</label>
                            <select className={inputClass} {...register("id_cidade")}>
                                {CIDADES_DISPONIVEIS.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Endereço</label>
                            <input type="text" className={inputClass} {...register("endereco")} />
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-[var(--line)] pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
