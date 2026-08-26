"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

// Mock de itens no carrinho
const mockCart = [
    { id: "1", marca: "Zara", tipo: "Casaco de Lã", tamanho: "M", preco: 189.90, imageUrl: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=600&auto=format&fit=crop" },
    { id: "3", marca: "Farm", tipo: "Vestido Estampado", tamanho: "P", preco: 220.00, imageUrl: "https://images.unsplash.com/photo-1572804013309-84a8f14450e0?q=80&w=600&auto=format&fit=crop" },
];

export default function CheckoutPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [entrega, setEntrega] = useState("1"); // 1: Correios, 2: Retirada

    const total = mockCart.reduce((acc, item) => acc + item.preco, 0);

    const handleFinalizarPedido = async () => {
        setIsSubmitting(true);

        // Simula o POST /api/pedidos exigido pela especificação
        const payload = {
            id_tipo_entrega: entrega,
            produtos: mockCart.map(item => item.id)
        };
        console.log("Enviando pedido:", payload);

        await new Promise(resolve => setTimeout(resolve, 1500));

        // Aqui no futuro faremos o redirecionamento para /checkout/sucesso/[id]
        alert("Pedido finalizado com sucesso! (Simulação)");
        setIsSubmitting(false);
    };

    return (
        <main className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link href="/produtos" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continuar garimpando
                </Link>
                <h1 className="mt-4 text-3xl font-medium tracking-tight text-[var(--foreground)]">Checkout</h1>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">

                {/* Lado Esquerdo: Lista de Produtos */}
                <div className="lg:col-span-7">
                    <h2 className="text-lg font-medium text-[var(--foreground)] mb-4 border-b border-[var(--line)] pb-2">
                        Suas peças ({mockCart.length})
                    </h2>

                    <ul className="divide-y divide-[var(--line)]">
                        {mockCart.map((item) => (
                            <li key={item.id} className="flex py-6">
                                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-[var(--radius)] bg-[var(--line)]">
                                    <img src={item.imageUrl} alt={item.tipo} className="h-full w-full object-cover" />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col justify-center">
                                    <div className="flex justify-between text-base font-medium text-[var(--foreground)]">
                                        <h3>{item.tipo}</h3>
                                        <p className="ml-4">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                                        </p>
                                    </div>
                                    <p className="mt-1 text-sm text-[var(--muted)]">{item.marca} • Tamanho {item.tamanho}</p>
                                    <div className="mt-2 text-sm text-[var(--danger)] cursor-pointer hover:underline inline-flex items-center gap-1 w-max">
                                        <Trash2 className="h-4 w-4" /> Remover
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Lado Direito: Resumo e Entrega */}
                <div className="lg:col-span-5">
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Resumo do pedido</h2>

                        {/* Opções de Entrega */}
                        <div className="mb-6 space-y-3">
                            <label className="text-sm font-medium text-[var(--foreground)]">Tipo de entrega</label>
                            <select
                                value={entrega}
                                onChange={(e) => setEntrega(e.target.value)}
                                className="w-full rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors hover:border-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            >
                                <option value="1">Correios (Envio padrão)</option>
                                <option value="2">Retirada no Local</option>
                            </select>
                        </div>

                        {/* Totais */}
                        <div className="space-y-4 border-t border-[var(--line)] pt-4 text-sm">
                            <div className="flex justify-between text-[var(--muted)]">
                                <p>Subtotal</p>
                                <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p>
                            </div>
                            <div className="flex justify-between text-[var(--muted)]">
                                <p>Frete</p>
                                <p>Calculado na próxima etapa</p>
                            </div>
                            <div className="flex justify-between border-t border-[var(--line)] pt-4 text-lg font-medium text-[var(--foreground)]">
                                <p>Total</p>
                                <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleFinalizarPedido}
                            disabled={isSubmitting}
                            className="mt-8 flex w-full items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            {isSubmitting ? "Processando..." : "Finalizar pedido"}
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}