export interface PeriodoFinanceiro {
    mes: number;
    ano: number;
    mes_nome: string;
    data_inicio?: string;
    data_fim?: string;
}

export interface KpisFinanceiros {
    faturamento_total: number;
    faturamento_produtos: number;
    faturamento_frete: number;
    faturamento_pendente: number;
    cmv: number;
    lucro_bruto: number;
    margem_bruta_percentual: number;
    ticket_medio: number;
    pedidos_faturados_count: number;
    pedidos_pendentes_count: number;
    pedidos_cancelados_count: number;
    pecas_vendidas_count: number;
    investimento_estoque: number;
    pecas_cadastradas_count: number;
}

export interface ResumoFinanceiroResponse {
    periodo: PeriodoFinanceiro;
    kpis: KpisFinanceiros;
}

export interface MesEvolucao {
    mes: number;
    mes_abrev: string;
    mes_nome: string;
    ano: number;
    faturamento: number;
    faturamento_total: number;
    cmv: number;
    lucro_bruto: number;
    investimento: number;
    pecas_vendidas: number;
    pecas_cadastradas: number;
    pedidos_count: number;
}

export interface EvolucaoAnualResponse {
    ano: number;
    totais_ano: {
        faturamento: number;
        cmv: number;
        lucro_bruto: number;
        investimento: number;
        pecas_vendidas: number;
        pecas_cadastradas: number;
    };
    meses: MesEvolucao[];
}

export interface CategoriaDesempenho {
    id_tipo: number;
    nome: string;
    quantidade_vendida: number;
    faturamento: number;
    cmv: number;
    lucro_bruto: number;
    margem_percentual: number;
    participacao_percentual: number;
}

export interface CategoriasResponse {
    periodo: {
        mes: number;
        ano: number;
        mes_nome: string;
    };
    total_faturamento_categorias: number;
    categorias: CategoriaDesempenho[];
}

export interface ItemFechamento {
    id_item_pedido: number;
    id_pedido: number;
    data_pedido: string;
    data_iso?: string;
    cliente_nome: string;
    id_produto: number;
    produto_titulo: string;
    categoria: string;
    tamanho: string;
    cor: string;
    fornecedor_nome: string;
    preco_custo: number;
    preco_venda: number;
    lucro: number;
    margem_percentual: number;
    status_pedido: string;
    conta_faturamento: boolean;
    tipo_entrega: string;
}

export interface FechamentoResponse {
    periodo: {
        mes: number;
        ano: number;
        mes_nome: string;
    };
    totais: {
        total_pecas: number;
        total_faturamento: number;
        total_cmv: number;
        total_lucro_bruto: number;
        margem_media: number;
    };
    itens: ItemFechamento[];
}

