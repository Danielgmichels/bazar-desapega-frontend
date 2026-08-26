import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck } from "lucide-react";

export default function PedidoDetalheClientePage({ params }: { params: { id: string } }) {
    // Mock simplificado do pedido para o cliente
    const pedido = {
        id: params.id,
        data: "25/08/2026",
        status: "Em Separação",
        total: 370.00,
        frete: 25.00,
        endereco: "Rua das Flores, 123 - Apto 42, São Paulo - SP",
        itens: [
            { id: "1", marca: "Zara", tipo: "Casaco de Lã", tamanho: "M", preco: 189.90, foto: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=200&auto=format&fit=crop" },
            { id: "2", marca: "Levi's", tipo: "Calça Jeans 501", tamanho: "40", preco: 155.10, foto: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=200&auto=format&fit=crop" },
        ]
    };

    return (
        <div className="flex flex-col gap-6 max-w-3xl">

            <div>
                <Link href="/minha-conta/pedidos" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para meus pedidos
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--line)] pb-4">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">Pedido #{pedido.id}</h1>
                        <p className="text-sm text-[var(--muted)]">Realizado em {pedido.data}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        <Package className="h-4 w-4" /> {pedido.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Endereço */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm flex flex-col gap-2">
                    <h3 className="font-medium text-[var(--foreground)] flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[var(--muted)]" /> Endereço de Entrega
                    </h3>
                    <p className="text-sm text-[var(--muted)]">{pedido.endereco}</p>
                </div>

                {/* Resumo Financeiro */}
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-[var(--muted)]">Subtotal</span>
                        <span>R$ 345,00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[var(--muted)]">Frete</span>
                        <span>R$ 25,00</span>
                    </div>
                    <div className="flex justify-between font-medium text-base pt-2 border-t border-[var(--line)]">
                        <span>Total Pago</span>
                        <span className="text-[var(--accent)]">R$ 370,00</span>
                    </div>
                </div>
            </div>

            {/* Itens */}
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                <div className="border-b border-[var(--line)] px-5 py-4">
                    <h3 className="font-medium text-[var(--foreground)]">Itens do Pedido</h3>
                </div>
                <ul className="divide-y divide-[var(--line)]">
                    {pedido.itens.map((item) => (
                        <li key={item.id} className="flex p-5 gap-4">
                            <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-[var(--line)]">
                                <img src={item.foto} alt={item.tipo} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <p className="font-medium text-[var(--foreground)]">{item.tipo}</p>
                                <p className="text-sm text-[var(--muted)]">{item.marca} • Tamanho {item.tamanho}</p>
                            </div>
                            <div className="flex items-center font-medium text-[var(--foreground)]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}