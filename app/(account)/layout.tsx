import { Header } from "@/components/ui/header";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}