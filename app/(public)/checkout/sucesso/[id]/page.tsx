"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Clock, ShieldCheck } from "lucide-react";

interface SucessoPageProps {
    params: Promise<{ id: string }>;
}

export default function CheckoutSucessoPage({ params }: SucessoPageProps) {
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;

    return (
        <main className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-xs">
                {/* Ícone de Sucesso */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-[var(--success)]">
                    <CheckCircle2 className="h-10 w-10" />
                </div>

                <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
                    Pedido Realizado com Sucesso!
                </h1>

                <p className="mt-2 text-sm text-[var(--muted)]">
                    Sua compra foi registrada no sistema e a peça foi reservada exclusivamente para você.
                </p>

                {/* Card de Resumo do Pedido */}
                <div className="mt-8 rounded-[var(--radius)] bg-[var(--background)] p-5 text-left border border-[var(--line)] space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[var(--muted)]">Número do Pedido:</span>
                        <span className="font-semibold text-[var(--foreground)]">#{orderId}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[var(--muted)]">Status Inicial:</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                            <Clock className="h-3 w-3" /> Aguardando Pagamento
                        </span>
                    </div>

                    <div className="border-t border-[var(--line)] pt-3 text-xs text-[var(--muted)] flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[var(--accent)] shrink-0" />
                        <span>Você receberá as atualizações de envio e comprovante nos seus pedidos.</span>
                    </div>
                </div>

                {/* Próximos Passos */}
                <div className="mt-8 flex flex-col gap-3">
                    <Link
                        href="/minha-conta/pedidos"
                        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        <Package className="h-4 w-4" /> Acompanhar em Meus Pedidos
                    </Link>

                    <Link
                        href="/produtos"
                        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
                    >
                        Continuar garimpando <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}

