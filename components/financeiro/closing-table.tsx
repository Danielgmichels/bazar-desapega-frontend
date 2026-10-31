"use client";

import { useState } from "react";
import {
    Download,
    Printer,
    Search,
    Filter,
    ArrowUpDown,
    CheckCircle,
    Clock,
    XCircle,
    FileSpreadsheet
} from "lucide-react";
import { ItemFechamento } from "@/contracts/financial";
import { formatBRL } from "./financial-kpi-cards";

interface ClosingTableProps {
    itens: ItemFechamento[];
    totais?: {
        total_pecas: number;
        total_faturamento: number;
        total_cmv: number;
        total_lucro_bruto: number;
        margem_media: number;
    };
    mesNome: string;
    ano: number;
    isLoading?: boolean;
}

export function ClosingTable({
    itens = [],
    totais,
    mesNome,
    ano,
    isLoading = false,
}: ClosingTableProps) {
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState<"todos" | "faturados" | "pendentes">("todos");

    // Filtragem local dos itens
    const itensFiltrados = itens.filter((item) => {
        const matchesBusca =
            busca === "" ||
            item.cliente_nome.toLowerCase().includes(busca.toLowerCase()) ||
            item.produto_titulo.toLowerCase().includes(busca.toLowerCase()) ||
            item.categoria.toLowerCase().includes(busca.toLowerCase()) ||
            String(item.id_pedido).includes(busca);

        if (!matchesBusca) return false;

        if (filtroStatus === "faturados") {
            return item.conta_faturamento;
        }
        if (filtroStatus === "pendentes") {
            return !item.conta_faturamento;
        }
        return true;
    });

    // Função de exportação para CSV compatível com Excel (incluindo BOM UTF-8)
    const handleExportCSV = () => {
        if (itens.length === 0) return;

        const cabecalhos = [
            "ID Pedido",
            "Data",
            "Cliente",
            "Peça",
            "Categoria",
            "Tamanho",
            "Cor",
            "Fornecedor",
            "Preço Custo (R$)",
            "Preço Venda (R$)",
            "Lucro Bruto (R$)",
            "Margem (%)",
            "Status Pedido",
            "Conta no Faturamento",
            "Tipo Entrega",
        ];

        const linhas = itensFiltrados.map((i) => [
            `#${i.id_pedido}`,
            `"${i.data_pedido}"`,
            `"${i.cliente_nome.replace(/"/g, '""')}"`,
            `"${i.produto_titulo.replace(/"/g, '""')}"`,
            `"${i.categoria}"`,
            `"${i.tamanho}"`,
            `"${i.cor}"`,
            `"${i.fornecedor_nome.replace(/"/g, '""')}"`,
            i.preco_custo.toFixed(2).replace(".", ","),
            i.preco_venda.toFixed(2).replace(".", ","),
            i.lucro.toFixed(2).replace(".", ","),
            i.margem_percentual.toFixed(1).replace(".", ",") + "%",
            `"${i.status_pedido}"`,
            i.conta_faturamento ? "Sim" : "Não",
            `"${i.tipo_entrega}"`,
        ]);

        const conteudoCsv =
            "\uFEFF" + // BOM para o Excel do Windows abrir com acentuação correta
            [cabecalhos.join(";"), ...linhas.map((l) => l.join(";"))].join("\r\n");

        const blob = new Blob([conteudoCsv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `fechamento-bazar-${mesNome.toLowerCase()}-${ano}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-xs">
            {/* Cabeçalho da Tabela com Filtros e Ações */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-[var(--line)]">
                <div>
                    <h2 className="text-base font-semibold text-[var(--foreground)]">
                        Fechamento Analítico de Vendas ({mesNome}/{ano})
                    </h2>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                        Extrato peça a peça com cálculo individual de CMV, lucro bruto e margem
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        disabled={itens.length === 0}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)] disabled:opacity-50"
                        title="Exportar tabela para Excel / CSV"
                    >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                        Exportar CSV (Excel)
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        disabled={itens.length === 0}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)] disabled:opacity-50"
                        title="Imprimir relatório do mês"
                    >
                        <Printer className="h-4 w-4 text-[var(--muted)]" />
                        Imprimir / PDF
                    </button>
                </div>
            </div>

            {/* Barra de Busca e Filtro de Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 bg-[var(--background)] border-b border-[var(--line)] print:hidden">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, peça ou pedido..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full rounded-md border border-[var(--line)] bg-[var(--surface)] pl-9 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        Status:
                    </span>
                    <div className="inline-flex rounded-md border border-[var(--line)] bg-[var(--surface)] p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setFiltroStatus("todos")}
                            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                filtroStatus === "todos"
                                    ? "bg-[var(--accent)] text-white"
                                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                            }`}
                        >
                            Todos ({itens.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltroStatus("faturados")}
                            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                filtroStatus === "faturados"
                                    ? "bg-emerald-600 text-white"
                                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                            }`}
                        >
                            Faturados ({itens.filter((i) => i.conta_faturamento).length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltroStatus("pendentes")}
                            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                filtroStatus === "pendentes"
                                    ? "bg-amber-600 text-white"
                                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                            }`}
                        >
                            Pendentes ({itens.filter((i) => !i.conta_faturamento).length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabela de Itens */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="border-b border-[var(--line)] bg-[var(--background)] font-medium text-[var(--muted)] uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Pedido</th>
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Cliente</th>
                            <th className="px-4 py-3">Peça / Produto</th>
                            <th className="px-4 py-3">Cat / Tam</th>
                            <th className="px-4 py-3 text-right">Custo (CMV)</th>
                            <th className="px-4 py-3 text-right">Preço Venda</th>
                            <th className="px-4 py-3 text-right">Lucro Bruto</th>
                            <th className="px-4 py-3 text-right">Margem</th>
                            <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={10} className="px-4 py-3">
                                        <div className="h-4 bg-[var(--line)] rounded w-full" />
                                    </td>
                                </tr>
                            ))
                        ) : itensFiltrados.length > 0 ? (
                            itensFiltrados.map((item) => (
                                <tr
                                    key={item.id_item_pedido}
                                    className={`hover:bg-[var(--background)] transition-colors ${
                                        !item.conta_faturamento ? "opacity-75 bg-zinc-50/50" : ""
                                    }`}
                                >
                                    <td className="px-4 py-2.5 font-mono font-medium text-[var(--foreground)]">
                                        #{item.id_pedido}
                                    </td>
                                    <td className="px-4 py-2.5 text-[var(--muted)] whitespace-nowrap">
                                        {item.data_pedido}
                                    </td>
                                    <td className="px-4 py-2.5 font-medium text-[var(--foreground)] max-w-[150px] truncate">
                                        {item.cliente_nome}
                                    </td>
                                    <td className="px-4 py-2.5 text-[var(--foreground)] max-w-[200px] truncate">
                                        <div className="font-medium">{item.produto_titulo}</div>
                                        <div className="text-[10px] text-[var(--muted)]">
                                            Fornecedor: {item.fornecedor_nome}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-[var(--muted)]">
                                        <span>{item.categoria}</span>
                                        <span className="mx-1">•</span>
                                        <span className="font-semibold text-[var(--foreground)]">
                                            {item.tamanho}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-mono text-[var(--muted)]">
                                        {formatBRL(item.preco_custo)}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-mono font-medium text-[var(--foreground)]">
                                        {formatBRL(item.preco_venda)}
                                    </td>
                                    <td
                                        className={`px-4 py-2.5 text-right font-mono font-semibold ${
                                            item.lucro >= 0 ? "text-emerald-700" : "text-red-700"
                                        }`}
                                    >
                                        {formatBRL(item.lucro)}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-mono">
                                        <span
                                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                item.margem_percentual >= 50
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : item.margem_percentual >= 20
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-amber-100 text-amber-800"
                                            }`}
                                        >
                                            {item.margem_percentual}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                                item.conta_faturamento
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-zinc-100 text-zinc-600 border-zinc-200"
                                            }`}
                                        >
                                            {item.conta_faturamento ? (
                                                <CheckCircle className="h-3 w-3" />
                                            ) : (
                                                <Clock className="h-3 w-3" />
                                            )}
                                            {item.status_pedido}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="py-12 text-center text-xs text-[var(--muted)]"
                                >
                                    Nenhuma venda encontrada para os critérios selecionados.
                                </td>
                            </tr>
                        )}
                    </tbody>

                    {/* Rodapé de Totais Consolidados */}
                    {totais && (
                        <tfoot className="border-t-2 border-[var(--line)] bg-[var(--background)] font-semibold text-xs text-[var(--foreground)]">
                            <tr>
                                <td colSpan={5} className="px-4 py-3">
                                    Total do Fechamento ({totais.total_pecas} peças confirmadas)
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-amber-700">
                                    {formatBRL(totais.total_cmv)}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-[var(--foreground)]">
                                    {formatBRL(totais.total_faturamento)}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-emerald-700">
                                    {formatBRL(totais.total_lucro_bruto)}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-emerald-700">
                                    {totais.margem_media}%
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--muted)]">
                                    Faturado
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
