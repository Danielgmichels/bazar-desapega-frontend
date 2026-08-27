import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // <-- Importe o provedor aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Bazar Desapega",
    description: "Curadoria de peças únicas e sustentáveis",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                {/* Envolva o children com o Providers */}
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}