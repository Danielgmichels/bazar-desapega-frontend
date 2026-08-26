"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";

// O mesmo schema do cadastro
const fornecedorSchema = z.object({
    nome: z.string().min(2, "O nome da empresa/fornecedor é obrigatório"),
    contato: z.string().min(2, "O nome do contato é obrigatório"),
    email: z.string().email("Digite um e-mail válido"),
    telefone: z.string().min(10, "Digite um telefone válido com DDD"),
    status: z.string().min(1, "Selecione o status"),
});

type FornecedorForm = z.infer<typeof fornecedorSchema>;

export default function EditarFornecedorPage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset, // Usaremos o reset para injetar os dados no formulário
        formState: { errors, isSubmitting },
    } = useForm<FornecedorForm>({
        resolver: zodResolver(fornecedorSchema),
    });

    // Simulando a busca dos dados na API usando o ID da URL
    useEffect(() => {
        const fetchFornecedor = async () => {
            // Simula tempo de rede
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock do dado vindo do banco baseado no ID
            const dadosDoBanco = {
                nome: "Boutique Vintage",
                contato: "Mariana",
                email: "contato@vintage.com",
                telefone: "(11) 98888-1111",
                status: "Ativo"
            };

            // Injeta os dados nos campos do formulário
            reset(dadosDoBanco);
            setIsLoading(false);
        };

        fetchFornecedor();
    }, [params.id, reset]);

    const onSubmit = async (data: FornecedorForm) => {
        console.log("Dados atualizados para a API:", { id: params.id, ...data });
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert("Fornecedor atualizado com sucesso!");
        router.push("/admin/fornecedores"); // Volta para a lista após salvar
    };

    const inputClass = "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-[var(--muted)]">Carregando dados do fornecedor...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/admin/fornecedores" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para fornecedores
                    </Link>
                    <h1 className="mt-2 text-2xl font-medium tracking-tight text-[var(--foreground)] flex items-center gap-2">
                        <Edit className="h-6 w-6 text-[var(--muted)]" />
                        Editar Fornecedor #{params.id}
                    </h1>
                </div>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]">Nome / Empresa</label>
                            <input type="text" className={inputClass} {...register("nome")} />
                            {errors.nome && <p className="text-xs text-[var(--danger)]">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Pessoa de Contato</label>
                            <input type="text" className={inputClass} {...register("contato")} />
                            {errors.contato && <p className="text-xs text-[var(--danger)]">{errors.contato.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Status</label>
                            <select className={inputClass} {...register("status")}>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                            {errors.status && <p className="text-xs text-[var(--danger)]">{errors.status.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">E-mail</label>
                            <input type="email" className={inputClass} {...register("email")} />
                            {errors.email && <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Telefone</label>
                            <input type="tel" className={inputClass} {...register("telefone")} />
                            {errors.telefone && <p className="text-xs text-[var(--danger)]">{errors.telefone.message}</p>}
                        </div>

                    </div>

                    <div className="flex justify-end border-t border-[var(--line)] pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}