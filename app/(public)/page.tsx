import Link from "next/link";
import { Filter, ShoppingBag } from "lucide-react";

// Mock das peças da vitrine
const mockProdutos = [
    { id: "1", marca: "Zara", tipo: "Casaco de Lã", tamanho: "M", preco: 189.90, foto: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=400&auto=format&fit=crop" },
    { id: "2", marca: "Levi's", tipo: "Calça Jeans 501", tamanho: "40", preco: 155.10, foto: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop" },
    { id: "3", marca: "Farm", tipo: "Vestido Estampado", tamanho: "P", preco: 220.00, foto: "https://images.unsplash.com/photo-1572804013309-84a8f14450e0?q=80&w=400&auto=format&fit=crop" },
    { id: "4", marca: "Nike", tipo: "Tênis Air Max", tamanho: "39", preco: 350.00, foto: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" },
];

export default function HomePage() {
    return (
        <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">

            {/* Hero / Banner Simples */}
            <div className="mb-12 flex flex-col items-center justify-center rounded-[var(--radius)] bg-[var(--surface)] px-6 py-16 text-center border border-[var(--line)] shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--foreground)]">
                    Curadoria de peças únicas.
                </h1>
                <p className="mt-4 max-w-xl text-[var(--muted)]">
                    Explore nosso acervo de desapegos de marcas incríveis com preços acessíveis. Sustentabilidade e estilo em um só lugar.
                </p>
            </div>

            {/* Barra de Filtros Visual */}
            <div className="mb-8 flex items-center justify-between border-b border-[var(--line)] pb-4">
                <h2 className="text-xl font-medium text-[var(--foreground)]">Novidades</h2>
                <button className="flex items-center gap-2 rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]">
                    <Filter className="h-4 w-4" /> Filtros
                </button>
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {mockProdutos.map((produto) => (
                    <div key={produto.id} className="group flex flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm transition-all hover:shadow-md">

                        <Link href={`/produtos/${produto.id}`} className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[var(--radius)] bg-[var(--background)]">
                            <img
                                src={produto.foto}
                                alt={produto.tipo}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>

                        <div className="flex flex-1 flex-col p-4">
                            <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                                <span>{produto.marca}</span>
                                <span>Tam: {produto.tamanho}</span>
                            </div>
                            <Link href={`/produtos/${produto.id}`} className="font-medium text-[var(--foreground)] hover:underline">
                                {produto.tipo}
                            </Link>

                            <div className="mt-auto pt-4 flex items-center justify-between">
                                <span className="font-medium text-lg text-[var(--foreground)]">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                                </span>
                                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--background)] text-[var(--foreground)] transition-colors hover:bg-[var(--accent)] hover:text-white" title="Adicionar à Cesta">
                                    <ShoppingBag className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}