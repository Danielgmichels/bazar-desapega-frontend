import { Header } from "@/components/ui/header";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            {/* O conteúdo das páginas (Home, Catálogo, Detalhe) entra aqui */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}