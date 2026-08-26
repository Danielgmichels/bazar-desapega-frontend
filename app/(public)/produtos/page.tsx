import { ProductCard } from "@/components/commerce/product-card";

// Dados simulados para testarmos o grid visualmente antes de plugar a API
const mockProducts = [
    { id: "1", marca: "Zara", tipo: "Casaco de Lã", tamanho: "M", preco: 189.90, imageUrl: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=600&auto=format&fit=crop" },
    { id: "2", marca: "Levi's", tipo: "Calça Jeans 501", tamanho: "40", preco: 150.00, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop" },
    { id: "3", marca: "Farm", tipo: "Vestido Estampado", tamanho: "P", preco: 220.00, imageUrl: "https://images.unsplash.com/photo-1572804013309-84a8f14450e0?q=80&w=600&auto=format&fit=crop" },
    { id: "4", marca: "Osklen", tipo: "Camisa de Linho", tamanho: "G", preco: 135.50, imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e32f85f98?q=80&w=600&auto=format&fit=crop" },
];

export default function CatalogPage() {
    return (
        <main className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
            {/* Cabeçalho do catálogo */}
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-medium tracking-tight">Acervo</h1>
                <button className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
                    Filtros
                </button>
            </div>

            {/* Grid Responsivo conforme especificação */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                {mockProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </main>
    );
}