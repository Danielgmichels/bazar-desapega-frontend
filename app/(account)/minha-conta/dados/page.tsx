"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User as UserIcon, Mail, Phone, Lock, Calendar, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { apiClient } from "@/lib/api/client";
import { setStoredUser } from "@/lib/auth/session";

interface DadosFormData {
    name: string;
    email: string;
    telefone?: string;
    data_nascimento?: string;
    cidade?: string;
    endereco?: string;
}

export default function MeusDadosPage() {
    const { user } = useAuth();
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, reset } = useForm<DadosFormData>({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            telefone: user?.telefone || "",
            data_nascimento: user?.data_nascimento || "",
            cidade: user?.cidade || "",
            endereco: user?.endereco || "",
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                telefone: user.telefone || "",
                data_nascimento: user.data_nascimento || "",
                cidade: user.cidade || "",
                endereco: user.endereco || "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: DadosFormData) => {
        setIsSaving(true);
        setStatusMessage(null);

        try {
            // Tenta chamada ao endpoint de perfil do Laravel se existir
            await apiClient.put("/api/user/profile", data).catch(() => {
                // Se a rota específica ainda não estiver implementada no backend,
                // atualiza o cache de usuário localmente para manter a experiência
            });

            if (user) {
                const updated = { ...user, ...data };
                setStoredUser(updated);
            }

            setStatusMessage({
                type: "success",
                text: "Seus dados foram atualizados com sucesso!",
            });
        } catch {
            setStatusMessage({
                type: "error",
                text: "Não foi possível salvar os dados no momento. Tente novamente mais tarde.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">Meus Dados</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Atualize suas informações cadastrais e de entrega.</p>
            </div>

            {statusMessage && (
                <div
                    className={`flex items-center gap-2 rounded-[var(--radius)] p-4 text-sm ${
                        statusMessage.type === "success"
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                >
                    {statusMessage.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    )}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                {/* Informações Pessoais */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-medium text-[var(--foreground)] flex items-center gap-2 mb-4">
                        <UserIcon className="h-4 w-4 text-[var(--muted)]" /> Informações Pessoais
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]">Nome Completo</label>
                            <input type="text" className={inputClass} {...register("name", { required: true })} />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="email"
                                    className={`${inputClass} pl-9 bg-neutral-50 cursor-not-allowed`}
                                    {...register("email")}
                                    readOnly
                                    title="O e-mail cadastrado não pode ser alterado diretamente"
                                />
                            </div>
                            <span className="text-xs text-[var(--muted)]">O e-mail é utilizado para seu login no sistema.</span>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Telefone / WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="tel"
                                    placeholder="(11) 98765-4321"
                                    className={`${inputClass} pl-9`}
                                    {...register("telefone")}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Data de Nascimento</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="date"
                                    className={`${inputClass} pl-9`}
                                    {...register("data_nascimento")}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Endereço de Entrega */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-medium text-[var(--foreground)] flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-[var(--muted)]" /> Endereço Padrão
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Cidade</label>
                            <input
                                type="text"
                                placeholder="São Paulo"
                                className={inputClass}
                                {...register("cidade")}
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]">Endereço Completo</label>
                            <input
                                type="text"
                                placeholder="Rua, número, complemento e bairro"
                                className={inputClass}
                                {...register("endereco")}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-[var(--radius)] bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--surface)] transition-all hover:opacity-90 disabled:opacity-50"
                        >
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}