"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    CircleDollarSign,
    RefreshCw,
    TrendingUp,
    Download,
    Calendar,
    AlertCircle
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import {
    ResumoFinanceiroResponse,
    EvolucaoAnualResponse,
    CategoriasResponse,
    FechamentoResponse
} from "@/contracts/financial";
import { PeriodSelector } from "@/components/financeiro/period-selector";
import { FinancialKpiCards } from "@/components/financeiro/financial-kpi-cards";
import { FinancialCharts } from "@/components/financeiro/financial-charts";
import { ClosingTable } from "@/components/financeiro/closing-table";

export default function AdminFinanceiroPage() {
    const hoje = new Date();
    const [mes, setMes] = useState<number>(hoje.getMonth() + 1);
    const [ano, setAno] = useState<number>(hoje.getFullYear());

    // 1. Resumo de KPIs do Mês
    const {
        data: resumoData,
        isLoading: loadingResumo,
        refetch: refetchResumo,
        isFetching: fetchingResumo,
    } = useQuery<ResumoFinanceiroResponse>({
        queryKey: ["admin-financeiro-resumo", mes, ano],
        queryFn: async () => {
            const res = await apiClient.get(`/api/admin/financeiro/resumo?mes=${mes}&ano=${ano}`);
            return res.data;
        },
    });

    // 2. Evolução Anual (Janeiro a Dezembro)
    const {
        data: evolucaoData,
        isLoading: loadingEvolucao,
        refetch: refetchEvolucao,
    } = useQuery<EvolucaoAnualResponse>({
        queryKey: ["admin-financeiro-evolucao", ano],
        queryFn: async () => {
            const res = await apiClient.get(`/api/admin/financeiro/evolucao?ano=${ano}`);
            return res.data;
        },
    });

    // 3. Desempenho por Categorias
    const {
        data: categoriasData,
        isLoading: loadingCategorias,
        refetch: refetchCategorias,
    } = useQuery<CategoriasResponse>({
        queryKey: ["admin-financeiro-categorias", mes, ano],
        queryFn: async () => {
            const res = await apiClient.get(`/api/admin/financeiro/categorias?mes=${mes}&ano=${ano}`);
            return res.data;
        },
    });

    // 4. Fechamento Analítico Peça a Peça
    const {
        data: fechamentoData,
        isLoading: loadingFechamento,
        refetch: refetchFechamento,
    } = useQuery<FechamentoResponse>({
        queryKey: ["admin-financeiro-fechamento", mes, ano],
        queryFn: async () => {
            const res = await apiClient.get(`/api/admin/financeiro/fechamento?mes=${mes}&ano=${ano}`);
            return res.data;
        },
    });

    const handlePeriodChange = (novoMes: number, novoAno: number) => {
        setMes(novoMes);
        setAno(novoAno);
    };

    const handleRefreshAll = () => {
        refetchResumo();
        refetchEvolucao();
        refetchCategorias();
        refetchFechamento();
    };

    const mesNome = resumoData?.periodo?.mes_nome || "Mês Selecionado";

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                        <CircleDollarSign className="h-7 w-7 text-[var(--accent)]" />
                        Controle Financeiro & Fechamento
                    </h1>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                        Painel de faturamento, apuração de CMV, margem de lucro e extrato mensal para o brechó.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleRefreshAll}
                        disabled={fetchingResumo}
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)] disabled:opacity-50"
                        title="Atualizar dados financeiros"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${fetchingResumo ? "animate-spin" : ""}`} />
                        Atualizar
                    </button>
                </div>
            </div>

            {/* Barra de Filtro de Período */}
            <PeriodSelector mes={mes} ano={ano} onChangePeriod={handlePeriodChange} />

            {/* Grid de Cards KPI */}
            <FinancialKpiCards kpis={resumoData?.kpis} isLoading={loadingResumo} />

            {/* Seção de Gráficos (Evolução Anual e Categorias) */}
            <FinancialCharts
                evolucaoMeses={evolucaoData?.meses}
                categorias={categoriasData?.categorias}
                ano={ano}
                mesNome={mesNome}
                isLoading={loadingEvolucao || loadingCategorias}
            />

            {/* Tabela de Fechamento Detalhado Peça a Peça */}
            <ClosingTable
                itens={fechamentoData?.itens || []}
                totais={fechamentoData?.totais}
                mesNome={mesNome}
                ano={ano}
                isLoading={loadingFechamento}
            />
        </div>
    );
}

