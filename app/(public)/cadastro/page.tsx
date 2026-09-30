"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { AlertCircle, Loader2 } from "lucide-react";

// Lista de cidades sincronizada com os IDs reais do banco de dados (CidadeSeeder)
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
    { id: 3376, nome: "Campinas - SP" },
    { id: 2163, nome: "Salvador - BA" },
    { id: 950, nome: "Fortaleza - CE" },
    { id: 1598, nome: "Recife - PE" },
    { id: 5418, nome: "Goiânia - GO" },
];

const registerSchema = z.object({
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    id_cidade: z.string().min(1, "Selecione sua cidade"),
    dataNascimento: z.string().optional(),
    telefone: z.string().optional(),
    endereco: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect");
    const { register: registerAuth } = useAuth();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            id_cidade: "4007", // Default: Curitiba
            nome: "",
            email: "",
            senha: "",
            dataNascimento: "",
            telefone: "",
            endereco: "",
        },
    });

    const onSubmit = async (data: RegisterForm) => {
        setApiError(null);

        // Mapeia rigorosamente para o contrato do Laravel (AuthController: nome, email, password, id_cidade)
        const payload = {
            nome: data.nome.trim(),
            name: data.nome.trim(),
            email: data.email.trim(),
            password: data.senha,
            password_confirmation: data.senha,
            id_cidade: Number(data.id_cidade),
            data_nascimento: data.dataNascimento ? data.dataNascimento : null,
            telefone: data.telefone?.trim() || null,
            endereco: data.endereco?.trim() || null,
        };

        const result = await registerAuth(payload);

        if (!result.success) {
            setApiError(result.error || "Não foi possível concluir o cadastro.");

            if (result.fieldErrors) {
                if (result.fieldErrors.email) {
                    setError("email", { message: result.fieldErrors.email[0] });
                }
                if (result.fieldErrors.password) {
                    setError("senha", { message: result.fieldErrors.password[0] });
                }
                if (result.fieldErrors.nome) {
                    setError("nome", { message: result.fieldErrors.nome[0] });
                }
                if (result.fieldErrors.id_cidade) {
                    setError("id_cidade", { message: result.fieldErrors.id_cidade[0] });
                }
            }
            return;
        }

        // Sucesso: redireciona para a rota solicitada ou vitrine
        router.push(redirectUrl || "/");
    };

    const inputClass =
        "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    return (
        <div className="w-full max-w-2xl rounded-[var(--radius)] bg-[var(--surface)] p-8 shadow-sm border border-[var(--line)]">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                    Crie sua conta
                </h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                    Preencha seus dados para começar a garimpar peças únicas no bazar.
                </p>
            </div>

            {apiError && (
                <div className="mb-6 flex items-start gap-2.5 rounded-[var(--radius)] bg-red-50 p-3 text-sm text-[var(--danger)] border border-red-200">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="nome">
                            Nome completo *
                        </label>
                        <input
                            id="nome"
                            type="text"
                            placeholder="Seu nome completo"
                            className={inputClass}
                            {...register("nome")}
                        />
                        {errors.nome && <p className="text-xs font-medium text-[var(--danger)]">{errors.nome.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
                            E-mail *
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="seu@email.com"
                            className={inputClass}
                            {...register("email")}
                        />
                        {errors.email && <p className="text-xs font-medium text-[var(--danger)]">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="senha">
                            Senha * (mínimo 6 caracteres)
                        </label>
                        <input
                            id="senha"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className={inputClass}
                            {...register("senha")}
                        />
                        {errors.senha && <p className="text-xs font-medium text-[var(--danger)]">{errors.senha.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="id_cidade">
                            Cidade / Estado *
                        </label>
                        <select id="id_cidade" className={inputClass} {...register("id_cidade")}>
                            {CIDADES_DISPONIVEIS.map((cidade) => (
                                <option key={cidade.id} value={cidade.id}>
                                    {cidade.nome}
                                </option>
                            ))}
                        </select>
                        {errors.id_cidade && (
                            <p className="text-xs font-medium text-[var(--danger)]">{errors.id_cidade.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="telefone">
                            Telefone / WhatsApp
                        </label>
                        <input
                            id="telefone"
                            type="tel"
                            placeholder="(00) 00000-0000"
                            className={inputClass}
                            {...register("telefone")}
                        />
                        {errors.telefone && <p className="text-xs font-medium text-[var(--danger)]">{errors.telefone.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="dataNascimento">
                            Data de nascimento
                        </label>
                        <input
                            id="dataNascimento"
                            type="date"
                            className={inputClass}
                            {...register("dataNascimento")}
                        />
                        {errors.dataNascimento && (
                            <p className="text-xs font-medium text-[var(--danger)]">{errors.dataNascimento.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="endereco">
                            Endereço de entrega (opcional)
                        </label>
                        <input
                            id="endereco"
                            type="text"
                            placeholder="Rua, número, complemento, bairro"
                            className={inputClass}
                            {...register("endereco")}
                        />
                        {errors.endereco && <p className="text-xs font-medium text-[var(--danger)]">{errors.endereco.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Criando conta...</span>
                        </>
                    ) : (
                        "Cadastrar"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--muted)]">
                Já tem uma conta?{" "}
                <Link
                    href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}
                    className="font-medium text-[var(--accent)] hover:underline"
                >
                    Fazer login
                </Link>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <Suspense fallback={<div className="text-[var(--muted)]">Carregando...</div>}>
                <RegisterFormContent />
            </Suspense>
        </main>
    );
}
