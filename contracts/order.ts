export type OrderStatus =
    | "Aguardando Pagamento"
    | "Pagamento Aprovado"
    | "Em Separação"
    | "Pronto para Retirada"
    | "Enviado"
    | "Entregue"
    | "Finalizado"
    | "Cancelado";

export interface OrderItem {
    id_produto: number | string;
    marca?: string;
    tipo?: string;
    tamanho?: string;
    preco_venda?: number;
    foto?: string;
}

export interface OrderCreatePayload {
    id_tipo_entrega: string | number;
    produtos: (number | string)[];
    id_cliente?: string | number;
    id_status_pedido?: string | number;
}

export interface OrderResponse {
    id_pedido: number | string;
    valor_total: number;
    status: OrderStatus | string;
    id_status_pedido?: number | string;
    id_tipo_entrega?: number | string;
    tipo_entrega_nome?: string;
    data_pedido?: string;
    produtos?: OrderItem[];
    message?: string;
    id_cliente?: number | string;
    cliente_nome?: string;
    cliente_email?: string;
    cliente_telefone?: string;
    endereco_entrega?: string;
}

