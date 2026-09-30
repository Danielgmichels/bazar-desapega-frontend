export interface ProdutoFoto {
    id_foto?: number | string;
    id_produto?: number | string;
    caminho_arquivo?: string;
    url_foto?: string;
    is_principal?: boolean | number;
}

export interface Produto {
    id?: number | string;
    id_produto?: number | string;
    marca: string;
    tipo?: string;
    nome?: string;
    genero?: string;
    tamanho: string;
    cor?: string;
    preco_venda: number;
    preco_custo?: number;
    foto_principal?: string;
    foto?: string;
    fotos?: ProdutoFoto[];
    disponibilidade?: string;
    disponivel?: boolean;
    status?: string;
    descricao?: string;
    data_entrada?: string;
    id_fornecedor?: number | string;
}

export interface ProductFilters {
    tipo?: string;
    genero?: string;
    tamanho?: string;
    busca?: string;
}

export type Product = Produto;


