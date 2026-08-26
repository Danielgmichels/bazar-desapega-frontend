"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

// 1. Schema do Zod: Regras para todos os campos exigidos na especificação
const registerSchema = z.object({
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    dataNascimento: z.string().min(1, "A data de nascimento é obrigatória"),
    telefone: z.string().min(10, "Digite um telefone válido com DDD"),
    cidade: z.string().min(2, "A cidade é obrigatória"),
    endereco: z.string().min(5, "O endereço completo é obrigatório"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        console.log("Payload de cadastro pronto para a API:", data);
        // Simula o tempo de rede
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl rounded-[var(--radius)] bg-[var(--surface)] p-8 shadow-sm border border-[var(--line)]">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                        Crie sua conta
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Preencha seus dados para começar a garimpar peças únicas.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Grid para organizar os campos em duas colunas em telas maiores */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="nome">
                                Nome completo
                            </label>
                            <input
                                id="nome"
                                type="text"
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                {...register("nome")}
                            />
                            {errors.nome && <p className="text-xs font-medium text-[var(--danger)]">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-xs font-medium text-[var(--danger)]">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="senha">
                                Senha
                            </label>
                            <input
                                id="senha"
                                type="password"
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                {...register("senha")}
                            />
                            {errors.senha && <p className="text-xs font-medium text-[var(--danger)]">{errors.senha.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="dataNascimento">
                                Data de nascimento
                            </label>
                            <input
                                id="dataNascimento"
                                type="date"
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                {...register("dataNascimento")}
                            />
                            {errors.dataNascimento && <p className="text-xs font-medium text-[var(--danger)]">{errors.dataNascimento.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="telefone">
                                Telefone (com DDD)
                            </label>
                            <input
                                id="telefone"
                                type="tel"
                                placeholder="(00) 00000-0000"
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                {...register("telefone")}
                            />
                            {errors.telefone && <p className="text-xs font-medium text-[var(--danger)]">{errors.telefone.message}</p>}
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="cidade">
                                Cidade / Estado
                            </label>
                            {/* O documento menciona que isso deverá virar um select depois, mas usamos texto enquanto a API não expõe a lista */}
                            <input
                                id="cidade"
                                type="text"
                                placeholder="Ex: Curitiba - PR"
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                {...register("cidade")}
                            />
                            {errors.cidade && <p className="text-xs font-medium text-[var(--danger)]">{errors.cidade.message}</p>}
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="endereco">
                                Endereço completo
                            </label>
                            <input
                                id="endereco"
                                type="text"
                                placeholder="Rua, número, complemento, bairro, CEP"
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                {...register("endereco")}
                            />
                            {errors.endereco && <p className="text-xs font-medium text-[var(--danger)]">{errors.endereco.message}</p>}
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-8 flex w-full items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {isSubmitting ? "Criando conta..." : "Criar conta"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--muted)]">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="font-medium text-[var(--accent)] hover:underline">
                        Faça login
                    </Link>
                </div>
            </div>
        </main>
    );
}