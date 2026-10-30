"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { MesEvolucao, CategoriaDesempenho } from "@/contracts/financial";
import { formatBRL } from "./financial-kpi-cards";

interface FinancialChartsProps {
    evolucaoMeses?: MesEvolucao[];
    categorias?: CategoriaDesempenho[];
    ano: number;
    mesNome: string;
    isLoading?: boolean;
}

const CORES_CATEGORIAS = [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ec4899", // Pink
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#f97316", // Orange
];

export function FinancialCharts({
    evolucaoMeses = [],
    categorias = [],
    ano,
    mesNome,
    isLoading = false,
}: FinancialChartsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 h-96 animate-pulse rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs" />
                <div className="h-96 animate-pulse rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs" />
            </div>
        );
    }

    // Prepara dados para o gráfico de pizza/rosca
    const pieData = categorias.map((c) => ({
        name: c.nome,
        value: c.faturamento,
        quantidade: c.quantidade_vendida,
        lucro: c.lucro_bruto,
        margem: c.margem_percentual,
    }));

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Gráfico 1: Evolução Mensal Comparativa (Ocupa 2 colunas) */}
            <div className="flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[var(--line)] gap-2">
                    <div>
                        <h2 className="text-base font-semibold text-[var(--foreground)]">
                            Evolução Financeira em {ano}
                        </h2>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                            Comparativo mensal de Faturamento, Custos (CMV) e Lucro Bruto
                        </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium text-[var(--muted)]">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            Faturamento
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            CMV
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                            Lucro
                        </span>
                    </div>
                </div>

                <div className="mt-6 h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={evolucaoMeses}
                            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                            <XAxis
                                dataKey="mes_abrev"
                                stroke="var(--muted)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: "var(--line)" }}
                            />
                            <YAxis
                                stroke="var(--muted)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `R$ ${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--surface)",
                                    borderColor: "var(--line)",
                                    borderRadius: "var(--radius)",
                                    fontSize: "12px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                                formatter={(value: any, name: any) => {
                                    const labels: Record<string, string> = {
                                        faturamento: "Faturamento",
                                        cmv: "Custo Mercadorias (CMV)",
                                        lucro_bruto: "Lucro Bruto",
                                        investimento: "Compras p/ Estoque",
                                    };
                                    return [formatBRL(Number(value) || 0), labels[String(name)] || name];
                                }}
                                labelFormatter={(label) => `Mês: ${label}`}
                            />
                            <Bar
                                dataKey="faturamento"
                                name="faturamento"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={32}
                            />
                            <Bar
                                dataKey="cmv"
                                name="cmv"
                                fill="#f59e0b"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={32}
                            />
                            <Bar
                                dataKey="lucro_bruto"
                                name="lucro_bruto"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico 2: Vendas por Categoria (1 Coluna) */}
            <div className="flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs">
                <div className="pb-4 border-b border-[var(--line)]">
                    <h2 className="text-base font-semibold text-[var(--foreground)]">
                        Categorias em {mesNome}
                    </h2>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                        Distribuição do faturamento por tipo de peça
                    </p>
                </div>

                {pieData.length > 0 ? (
                    <div className="flex flex-col flex-1 justify-between">
                        <div className="mt-4 h-52 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CORES_CATEGORIAS[index % CORES_CATEGORIAS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--surface)",
                                            borderColor: "var(--line)",
                                            borderRadius: "var(--radius)",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value: any, name: any, item: any) => [
                                            `${formatBRL(Number(value) || 0)} (${item.payload.quantidade} peças)`,
                                            name,
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legenda compacta com ranking */}
                        <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-3 max-h-36 overflow-y-auto">
                            {categorias.slice(0, 5).map((cat, i) => (
                                <div
                                    key={cat.id_tipo}
                                    className="flex items-center justify-between text-xs"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <span
                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    CORES_CATEGORIAS[i % CORES_CATEGORIAS.length],
                                            }}
                                        />
                                        <span className="font-medium text-[var(--foreground)] truncate">
                                            {cat.nome}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 font-mono">
                                        <span className="text-[var(--muted)]">
                                            {cat.participacao_percentual}%
                                        </span>
                                        <span className="font-semibold text-[var(--foreground)]">
                                            {formatBRL(cat.faturamento)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-xs text-[var(--muted)]">
                        Nenhuma venda registrada nas categorias para o mês selecionado.
                    </div>
                )}
            </div>
        </div>
    );
}
