"use client";

import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface PeriodSelectorProps {
    mes: number;
    ano: number;
    onChangePeriod: (mes: number, ano: number) => void;
}

const MESES = [
    { valor: 1, nome: "Janeiro" },
    { valor: 2, nome: "Fevereiro" },
    { valor: 3, nome: "Março" },
    { valor: 4, nome: "Abril" },
    { valor: 5, nome: "Maio" },
    { valor: 6, nome: "Junho" },
    { valor: 7, nome: "Julho" },
    { valor: 8, nome: "Agosto" },
    { valor: 9, nome: "Setembro" },
    { valor: 10, nome: "Outubro" },
    { valor: 11, nome: "Novembro" },
    { valor: 12, nome: "Dezembro" },
];

const ANOS = [2024, 2025, 2026, 2027, 2028];

export function PeriodSelector({ mes, ano, onChangePeriod }: PeriodSelectorProps) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const handlePrevMonth = () => {
        if (mes === 1) {
            onChangePeriod(12, ano - 1);
        } else {
            onChangePeriod(mes - 1, ano);
        }
    };

    const handleNextMonth = () => {
        if (mes === 12) {
            onChangePeriod(1, ano + 1);
        } else {
            onChangePeriod(mes + 1, ano);
        }
    };

    const handleCurrentMonth = () => {
        onChangePeriod(mesAtual, anoAtual);
    };

    const handleLastMonth = () => {
        if (mesAtual === 1) {
            onChangePeriod(12, anoAtual - 1);
        } else {
            onChangePeriod(mesAtual - 1, anoAtual);
        }
    };

    const isCurrentMonth = mes === mesAtual && ano === anoAtual;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-xs">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Calendar className="h-5 w-5" />
                </div>
                <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                        Período Selecionado
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                        <select
                            value={mes}
                            onChange={(e) => onChangePeriod(Number(e.target.value), ano)}
                            className="rounded-md border border-[var(--line)] bg-[var(--background)] px-2.5 py-1 text-sm font-semibold text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                        >
                            {MESES.map((m) => (
                                <option key={m.valor} value={m.valor}>
                                    {m.nome}
                                </option>
                            ))}
                        </select>

                        <select
                            value={ano}
                            onChange={(e) => onChangePeriod(mes, Number(e.target.value))}
                            className="rounded-md border border-[var(--line)] bg-[var(--background)] px-2.5 py-1 text-sm font-semibold text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                        >
                            {ANOS.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-md border border-[var(--line)] bg-[var(--background)] p-0.5">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"
                        title="Mês Anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"
                        title="Próximo Mês"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleCurrentMonth}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        isCurrentMonth
                            ? "bg-[var(--accent)] text-white shadow-xs"
                            : "border border-[var(--line)] bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                >
                    Mês Atual
                </button>

                <button
                    type="button"
                    onClick={handleLastMonth}
                    className="rounded-md border border-[var(--line)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    Mês Passado
                </button>
            </div>
        </div>
    );
}

