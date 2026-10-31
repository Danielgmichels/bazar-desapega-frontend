"use client";

import {
    TrendingUp,
    DollarSign,
    ShoppingBag,
    PackagePlus,
    Percent,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Scale
} from "lucide-react";
import { KpisFinanceiros } from "@/contracts/financial";

interface FinancialKpiCardsProps {
    kpis?: KpisFinanceiros;
    isLoading?: boolean;
}

export function formatBRL(valor: number = 0): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

export function FinancialKpiCards({ kpis, isLoading }: FinancialKpiCardsProps) {
    if (isLoading || !kpis) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-xs"
                    >
                        <div className="h-4 w-24 bg-[var(--line)] rounded mb-3" />
                        <div className="h-7 w-32 bg-[var(--line)] rounded mb-2" />
                        <div className="h-3 w-20 bg-[var(--line)] rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            titulo: "Faturamento Confirmado",
            valor: formatBRL(kpis.faturamento_total),
            subtitulo: `${kpis.pedidos_faturados_count} ${
                kpis.pedidos_faturados_count === 1 ? "pedido faturado" : "pedidos faturados"
            }`,
            icone: DollarSign,
            destaque: "emerald",
            badge: "Receita",
        },
        {
            titulo: "Custo Mercadorias (CMV)",
            valor: formatBRL(kpis.cmv),
            subtitulo: `${
                kpis.faturamento_produtos > 0
                    ? ((kpis.cmv / kpis.faturamento_produtos) * 100).toFixed(1)
                    : 0
            }% das vendas`,
            icone: ShoppingBag,
            destaque: "amber",
            badge: "Custo Saídas",
        },
        {
            titulo: "Lucro Bruto do Mês",
            valor: formatBRL(kpis.lucro_bruto),
            subtitulo: `Margem de ${kpis.margem_bruta_percentual}%`,
            icone: TrendingUp,
            destaque: kpis.lucro_bruto >= 0 ? "emerald" : "red",
            badge: `${kpis.margem_bruta_percentual}%`,
        },
        {
            titulo: "Compras p/ Estoque",
            valor: formatBRL(kpis.investimento_estoque),
            subtitulo: `${kpis.pecas_cadastradas_count} ${
                kpis.pecas_cadastradas_count === 1 ? "peça entrada" : "peças entradas"
            }`,
            icone: PackagePlus,
            destaque: "indigo",
            badge: "Investimento",
        },
        {
            titulo: "Giro de Peças",
            valor: `${kpis.pecas_vendidas_count} / ${kpis.pecas_cadastradas_count}`,
            subtitulo: "Peças vendidas vs entradas",
            icone: Scale,
            destaque: "blue",
            badge: kpis.pecas_vendidas_count >= kpis.pecas_cadastradas_count ? "Giro Alto" : "Giro Normal",
        },
        {
            titulo: "Ticket Médio",
            valor: formatBRL(kpis.ticket_medio),
            subtitulo: kpis.faturamento_pendente > 0 ? `${formatBRL(kpis.faturamento_pendente)} pendente` : "Tudo quitado",
            icone: Percent,
            destaque: "purple",
            badge: "Média",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((c) => (
                <div
                    key={c.titulo}
                    className="flex flex-col justify-between rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-xs transition-all hover:border-[var(--muted)]"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--muted)]">{c.titulo}</span>
                        <div className="rounded-md bg-[var(--background)] p-1.5 text-[var(--accent)] border border-[var(--line)]">
                            <c.icone className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                            {c.valor}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-[var(--muted)]">{c.subtitulo}</span>
                            <span className="rounded bg-[var(--background)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--foreground)] border border-[var(--line)]">
                                {c.badge}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

