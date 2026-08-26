"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

// 1. Schema do Zod: Define as regras e as mensagens de erro
const loginSchema = z.object({
    email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Inferindo o tipo do TypeScript a partir do schema
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    // 2. Configuração do React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    // 3. Ação do formulário (Por enquanto, apenas um mock)
    const onSubmit = async (data: LoginForm) => {
        console.log("Payload pronto para a API:", data);
        // Simula um tempo de carregamento
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm rounded-[var(--radius)] bg-[var(--surface)] p-8 shadow-sm border border-[var(--line)]">

                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                        Acesse sua conta
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Entre para finalizar pedidos e gerenciar desapegos.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Campo E-mail */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs font-medium text-[var(--danger)]">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Campo Senha */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="password">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-xs font-medium text-[var(--danger)]">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Botão de Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-8 flex w-full items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                    >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--muted)]">
                    Não tem uma conta?{" "}
                    <Link href="/cadastro" className="font-medium text-[var(--accent)] hover:underline">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </main>
    );
}