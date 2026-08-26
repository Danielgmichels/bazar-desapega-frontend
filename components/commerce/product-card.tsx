import Link from "next/link";

interface ProductCardProps {
    id: string;
    marca: string;
    tipo: string;
    tamanho: string;
    preco: number;
    imageUrl: string;
}

export function ProductCard({ id, marca, tipo, tamanho, preco, imageUrl }: ProductCardProps) {
    return (
        <Link href={`/produtos/${id}`} className="group flex flex-col gap-3">
            {/* Moldura da imagem com fundo neutro para caso a imagem demore a carregar */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius)] bg-[var(--line)]">
                {/* Usando tag img padrão temporariamente. Depois trocaremos para next/image para otimização */}
                <img
                    src={imageUrl}
                    alt={`${tipo} da marca ${marca}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Informações da peça */}
            <div className="flex flex-col">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-medium text-[var(--foreground)]">{marca}</h3>
                    <span className="text-base font-medium text-[var(--foreground)]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco)}
                    </span>
                </div>
                <p className="text-sm text-[var(--muted)]">{tipo} • {tamanho}</p>
            </div>
        </Link>
    );
}