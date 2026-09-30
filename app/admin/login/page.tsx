"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";

const adminLoginSchema = z.object({
    email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

function AdminLoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error");
    const redirectUrl = searchParams.get("redirect") || "/admin";
    const { login, logout } = useAuth();
    const [apiError, setApiError] = useState<string | null>(
        urlError === "unauthorized" ? "Sua conta não possui privilégios de administrador." : null
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminLoginForm>({
        resolver: zodResolver(adminLoginSchema),
    });

    const onSubmit = async (data: AdminLoginForm) => {
        setApiError(null);
        const result = await login(data);

        if (!result.success) {
            setApiError(result.error || "E-mail ou senha incorretos.");
            return;
        }

        const isUserAdmin = Boolean(
            result.user && (
                result.user.is_admin === true ||
                result.user.is_admin === 1 ||
                String(result.user.is_admin) === "1"
            )
        );

        if (!isUserAdmin) {
            logout();
            setApiError("Acesso não autorizado: esta conta não possui privilégios administrativos.");
            return;
        }

        const target = redirectUrl.startsWith("/admin") && redirectUrl !== "/admin/login" ? redirectUrl : "/admin";
        window.location.href = target;
    };


    return (
        <div className="w-full max-w-sm rounded-[var(--radius)] bg-[var(--surface)] p-8 shadow-sm border border-[var(--line)]">
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                    Bazar Admin
                </h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                    Área restrita de gestão e controle operacional
                </p>
            </div>

            {apiError && (
                <div className="mb-5 flex items-start gap-2.5 rounded-[var(--radius)] bg-red-50 p-3 text-sm text-[var(--danger)] border border-red-200">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
                        E-mail do Administrador
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@bazardesapega.com.br"
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-xs font-medium text-[var(--danger)]">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="password">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-xs font-medium text-[var(--danger)]">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Validando credenciais...</span>
                        </>
                    ) : (
                        "Acessar Painel"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--muted)]">
                <Link href="/" className="font-medium hover:text-[var(--foreground)] hover:underline">
                    ← Voltar para a vitrine
                </Link>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
            <Suspense fallback={<div className="text-[var(--muted)]">Carregando...</div>}>
                <AdminLoginFormContent />
            </Suspense>
        </main>
    );
}

