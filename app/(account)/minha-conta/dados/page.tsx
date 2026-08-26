"use client";

import { useForm } from "react-hook-form";
import { User, Mail, Phone, Lock } from "lucide-react";

export default function MeusDadosPage() {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            nome: "Maria Oliveira",
            email: "maria.oliveira@email.com",
            telefone: "(11) 99999-1111",
            cpf: "111.222.333-44"
        }
    });

    const onSubmit = (data: any) => {
        alert("Dados atualizados com sucesso!");
    };

    const inputClass = "w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">Meus Dados</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Atualize suas informações pessoais e senha de acesso.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">

                {/* Informações Pessoais */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-medium text-[var(--foreground)] flex items-center gap-2 mb-4">
                        <User className="h-4 w-4 text-[var(--muted)]" /> Informações Pessoais
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-[var(--foreground)]">Nome Completo</label>
                            <input type="text" className={inputClass} {...register("nome")} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                                <input type="email" className={`${inputClass} pl-9`} {...register("email")} readOnly title="O e-mail não pode ser alterado" />
                            </div>
                            <span className="text-xs text-[var(--muted)]">Para mudar o e-mail, contate o suporte.</span>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">CPF</label>
                            <input type="text" className={inputClass} {...register("cpf")} readOnly title="O CPF não pode ser alterado" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                                <input type="tel" className={`${inputClass} pl-9`} {...register("telefone")} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="rounded-[var(--radius)] bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--surface)] transition-colors hover:opacity-90">
                            Salvar Dados
                        </button>
                    </div>
                </div>

                {/* Alterar Senha */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-medium text-[var(--foreground)] flex items-center gap-2 mb-4">
                        <Lock className="h-4 w-4 text-[var(--muted)]" /> Alterar Senha
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Nova Senha</label>
                            <input type="password" placeholder="Mínimo de 8 caracteres" className={inputClass} />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="button" className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-6 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]">
                                Atualizar Senha
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}