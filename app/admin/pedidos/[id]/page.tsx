"use client";

import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle, CreditCard, Box } from "lucide-react";

// Mock de um pedido detalhado
const mockPedido = {
    id: "1041",
    data: "25/08/2026",
    cliente: { nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-9999" },
    entrega: { tipo: "Correios", endereco: "Rua das Flores, 123 - São Paulo, SP" },
    total: 370.00,
    statusAtual: "Em Separação",
    itens: [
        { id: "1", marca: "Zara", tipo: "Casaco de Lã", tamanho: "M", preco: 189.90, foto: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=200&auto=format&fit=crop" },
        { id: "2", marca: "Levi's", tipo: "Calça Jeans 501", tamanho: "40", preco: 180.10, foto: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=200&auto=format&fit=crop" },
    ]
};

// Fluxo padrão de status exigido pela API
const fluxoStatus = [
    { nome: "Aguardando Pagamento", icone: CreditCard },
    { nome: "Em Separação", icone: Box },
    { nome: "Enviado", icone: Truck }, // Ou "Pronto para Retirada" dependendo do tipo
    { nome: "Finalizado", icone: CheckCircle },
];

export default function PedidoDetalhePage({ params }: { params: { id: string } }) {
    // Descobre em qual passo o pedido está
    const statusIndex = fluxoStatus.findIndex(s => s.nome === mockPedido.statusAtual);

    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-6">

            {/* Navegação e Título */}
            <div>
                <Link href="/admin/pedidos" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para pedidos
                </Link>
                <div className="mt-2 flex items-center justify-between">
                    <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                        Pedido #{mockPedido.id}
                    </h1>
                    <button className="rounded-[var(--radius)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--surface)] transition-all hover:opacity-90">
                        Avançar Status
                    </button>
                </div>
            </div>

            {/* TIMELINE VISUAL */}
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                <div className="flex items-center justify-between relative">
                    {/* Linha de fundo conectando os ícones */}
                    <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-[var(--line)] z-0"></div>

                    {fluxoStatus.map((passo, index) => {
                        const isCompleted = index <= statusIndex;
                        const isCurrent = index === statusIndex;
                        const Icon = passo.icone;

                        return (
                            <div key={passo.nome} className="relative z-10 flex flex-col items-center gap-2 bg-[var(--surface)] px-2">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${isCompleted
                                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                        : "border-[var(--line)] bg-[var(--background)] text-[var(--muted)]"
                                    }`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={`text-xs font-medium ${isCurrent ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                                    {passo.nome}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LISTA DE ITENS */}
                <div className="lg:col-span-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-medium text-[var(--foreground)]">Peças do Pedido</h2>
                    <ul className="divide-y divide-[var(--line)]">
                        {mockPedido.itens.map((item) => (
                            <li key={item.id} className="flex py-4">
                                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-[var(--line)]">
                                    <img src={item.foto} alt={item.tipo} className="h-full w-full object-cover" />
                                </div>
                                <div className="ml-4 flex flex-1 justify-between">
                                    <div>
                                        <p className="font-medium text-[var(--foreground)]">{item.tipo}</p>
                                        <p className="text-sm text-[var(--muted)]">{item.marca} • Tamanho {item.tamanho}</p>
                                    </div>
                                    <p className="font-medium text-[var(--foreground)]">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* INFORMAÇÕES DO CLIENTE E TOTAL */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-[var(--foreground)]">Cliente e Entrega</h2>
                        <div className="space-y-3 text-sm text-[var(--foreground)]">
                            <div>
                                <p className="text-[var(--muted)]">Nome</p>
                                <p className="font-medium">{mockPedido.cliente.nome}</p>
                            </div>
                            <div>
                                <p className="text-[var(--muted)]">Contato</p>
                                <p>{mockPedido.cliente.email}</p>
                                <p>{mockPedido.cliente.telefone}</p>
                            </div>
                            <div className="border-t border-[var(--line)] pt-3">
                                <p className="text-[var(--muted)]">Modalidade</p>
                                <p className="font-medium flex items-center gap-2"><Package className="h-4 w-4" /> {mockPedido.entrega.tipo}</p>
                                <p className="mt-1">{mockPedido.entrega.endereco}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <div className="flex items-center justify-between text-lg font-medium text-[var(--foreground)]">
                            <span>Total Pago</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mockPedido.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}