import { redirect } from "next/navigation";

export default function MinhaContaIndexPage() {
    // Redireciona automaticamente para a aba principal do cliente
    redirect("/minha-conta/pedidos");
}