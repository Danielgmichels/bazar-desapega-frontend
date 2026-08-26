import Link from "next/link";
import { ChevronRight, Package, CheckCircle, Truck } from "lucide-react";

const mockMeusPedidos = [
    {
        id: "1041",
        data: "25/08/2026",
        total: 370.00,
        status: "Em Separação",
        itens: "Casaco de Lã, Calça Jeans 501",
        icone: Package,
        corStatus: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
        id: "0980",
        data: "10/07/2026",
        total: 450.00,
        status: "Finalizado",
        itens: "Vestido Estampado, Bota de Couro",
        icone: CheckCircle,
        corStatus: "text-green-700 bg-green-50 border-green-200"
    },
];

export default function MeusPedidosPage() {
    return (
        <div className="flex flex-col gap-6">

            <div>
                <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">Histórico de Compras</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Acompanhe o status dos seus pedidos atuais e antigos.</p>
            </div>

            <div className="flex flex-col gap-4">
                {mockMeusPedidos.map((pedido) => (
                    <div
                        key={pedido.id}
                        className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm transition-colors hover:border-neutral-300 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-[var(--foreground)]">Pedido #{pedido.id}</span>
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${pedido.corStatus}`}>
                                    <pedido.icone className="h-3 w-3" />
                                    {pedido.status}
                                </span>
                            </div>
                            <span className="text-sm text-[var(--muted)]">Realizado em {pedido.data}</span>
                            <span className="text-sm text-[var(--muted)] mt-2">
                                <strong className="font-medium text-[var(--foreground)]">Itens:</strong> {pedido.itens}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-[var(--line)] pt-4 sm:border-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-3">
                            <span className="font-medium text-[var(--foreground)]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}
                            </span>
                            <Link
                                href={"/minha-conta/pedidos/${pedido.id}"}
                                className="inline-flex items-center text-sm font-medium text-[var(--accent)] hover:underline"
                            >
                                Ver detalhes <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                ))}

                {mockMeusPedidos.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--muted)] py-12 text-center">
                        <Package className="mb-2 h-8 w-8 text-[var(--muted)]" />
                        <p className="font-medium text-[var(--foreground)]">Nenhum pedido encontrado</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">Você ainda não fez nenhuma compra no bazar.</p>
                        <Link
                            href="/produtos"
                            className="mt-4 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
                        >
                            Começar a garimpar
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
}