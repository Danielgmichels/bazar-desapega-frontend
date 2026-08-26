import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Simulando a busca de uma peça na API pelo ID
const mockProduct = {
    id: "1",
    marca: "Zara",
    tipo: "Casaco de Lã",
    tamanho: "M",
    genero: "Feminino",
    cor: "Caramelo",
    preco: 189.90,
    isUnica: true,
    imageUrl: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop"
};

export default function ProductDetail({ params }: { params: { id: string } }) {
    return (
        <main className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
            {/* Navegação de retorno */}
            <div className="mb-6">
                <Link href="/produtos" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o acervo
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Lado Esquerdo: Imagem (Moldura Editorial) */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius)] bg-[var(--line)]">
                    <img
                        src={mockProduct.imageUrl}
                        alt={`${mockProduct.tipo} da marca ${mockProduct.marca}`}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Lado Direito: Informações e Compra */}
                <div className="flex flex-col justify-center pt-6 lg:pt-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-medium tracking-tight text-[var(--foreground)] sm:text-4xl">
                            {mockProduct.tipo}
                        </h1>
                        <p className="mt-2 text-xl font-medium text-[var(--muted)]">
                            {mockProduct.marca}
                        </p>
                    </div>

                    <div className="mb-8">
                        <p className="text-3xl font-medium text-[var(--foreground)]">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mockProduct.preco)}
                        </p>
                        {mockProduct.isUnica && (
                            <span className="mt-3 inline-flex items-center rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium text-[var(--accent)]">
                                Peça Única
                            </span>
                        )}
                    </div>

                    <dl className="mb-8 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="text-[var(--muted)]">Tamanho</dt>
                            <dd className="font-medium text-[var(--foreground)] mt-1">{mockProduct.tamanho}</dd>
                        </div>
                        <div>
                            <dt className="text-[var(--muted)]">Gênero</dt>
                            <dd className="font-medium text-[var(--foreground)] mt-1">{mockProduct.genero}</dd>
                        </div>
                        <div>
                            <dt className="text-[var(--muted)]">Cor</dt>
                            <dd className="font-medium text-[var(--foreground)] mt-1">{mockProduct.cor}</dd>
                        </div>
                    </dl>

                    <button className="flex w-full items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] px-8 py-4 text-base font-medium text-white transition-colors hover:bg-opacity-90">
                        Comprar peça
                    </button>
                </div>
            </div>
        </main>
    );
}