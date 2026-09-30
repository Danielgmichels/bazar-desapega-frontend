import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            {/* O conteúdo das páginas (Home, Catálogo, Detalhe) entra aqui */}
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}