"use client";

import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, ShieldAlert, ShoppingBag } from "lucide-react";

// Mock de dados do cliente completo
const mockCliente = {
    id: "C001",
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    telefone: "(11) 99999-1111",
    cpf: "111.222.333-44",
    dataNascimento: "12/05/1990",
    dataCadastro: "15/08/2026",
    endereco: {
        rua: "Rua das Flores",
        numero: "123",
        complemento: "Apto 42",
        bairro: "Jardim Paulista",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01415-000"
    },
    metricas: {
        totalPedidos: 3,
        totalGasto: 845.90,
    },
    // Histórico de pedidos desse cliente específico
    historicoPedidos: [
        { id: "1042", data: "26/08/2026", total: 189.90, status: "Aguardando Pagamento" },
        { id: "0980", data: "10/07/2026", total: 450.00, status: "Finalizado" },
        { id: "0812", data: "05/05/2026", total: 206.00, status: "Finalizado" },
    ]
};

export default function ClienteDetalhePage({ params }: { params: { id: string } }) {

    const handleResetSenha = () => {
        alert("Um link de redefinição de senha foi enviado para o e-mail do cliente. (Simulação)");
    };

    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-8">

            {/* Navegação e Título */}
            <div>
                <Link href="/admin/clientes" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para clientes
                </Link>
                <div className="mt-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)]">
                            {mockCliente.nome}
                        </h1>
                        <p className="text-sm text-[var(--muted)]">Cliente ID: #{mockCliente.id}</p>
                    </div>

                    {/* Ações de Conta */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleResetSenha}
                            className="flex items-center justify-center rounded-[var(--radius)] border border-solid border-[var(--muted)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
                        >
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Resetar Senha
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* COLUNA ESQUERDA: Dados Pessoais e Endereço */}
                <div className="flex flex-col gap-6 lg:col-span-2">

                    {/* Card de Dados Pessoais */}
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                            <User className="h-5 w-5 text-[var(--muted)]" /> Informações Pessoais
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[var(--muted)]">E-mail</p>
                                <p className="font-medium text-[var(--foreground)] flex items-center gap-1.5 mt-1">
                                    <Mail className="h-3.5 w-3.5" /> {mockCliente.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-[var(--muted)]">Telefone</p>
                                <p className="font-medium text-[var(--foreground)] flex items-center gap-1.5 mt-1">
                                    <Phone className="h-3.5 w-3.5" /> {mockCliente.telefone}
                                </p>
                            </div>
                            <div>
                                <p className="text-[var(--muted)]">CPF</p>
                                <p className="font-medium text-[var(--foreground)] mt-1">{mockCliente.cpf}</p>
                            </div>
                            <div>
                                <p className="text-[var(--muted)]">Data de Nascimento</p>
                                <p className="font-medium text-[var(--foreground)] flex items-center gap-1.5 mt-1">
                                    <Calendar className="h-3.5 w-3.5" /> {mockCliente.dataNascimento}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card de Endereço Principal */}
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[var(--muted)]" /> Endereço Padrão de Entrega
                        </h2>
                        <div className="text-sm text-[var(--foreground)] space-y-1">
                            <p><span className="font-medium">{mockCliente.endereco.rua}, {mockCliente.endereco.numero}</span> {mockCliente.endereco.complemento && `- ${mockCliente.endereco.complemento}`}</p>
                            <p>{mockCliente.endereco.bairro}</p>
                            <p>{mockCliente.endereco.cidade} - {mockCliente.endereco.estado}</p>
                            <p className="text-[var(--muted)]">CEP: {mockCliente.endereco.cep}</p>
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA: Resumo e Métricas */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-[var(--muted)]" /> Valor Vitalício (LTV)
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-[var(--muted)]">Total Gasto na Loja</p>
                                <p className="text-3xl font-medium text-[var(--accent)] mt-1">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mockCliente.metricas.totalGasto)}
                                </p>
                            </div>
                            <div className="border-t border-[var(--line)] pt-4">
                                <p className="text-sm text-[var(--muted)]">Membro desde</p>
                                <p className="font-medium text-[var(--foreground)] mt-1">{mockCliente.dataCadastro}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* TABELA DE HISTÓRICO DE PEDIDOS */}
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                <div className="border-b border-[var(--line)] px-6 py-4">
                    <h2 className="text-base font-medium text-[var(--foreground)] flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-[var(--muted)]" /> Histórico de Pedidos ({mockCliente.metricas.totalPedidos})
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--background)] text-[var(--muted)] border-b border-[var(--line)]">
                            <tr>
                                <th className="px-6 py-3 font-medium">Pedido</th>
                                <th className="px-6 py-3 font-medium">Data</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--line)]">
                            {mockCliente.historicoPedidos.map((pedido) => (
                                <tr key={pedido.id} className="transition-colors hover:bg-[var(--background)]">
                                    <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                                        <Link href={`/admin/pedidos/${pedido.id}`} className="hover:underline">#{pedido.id}</Link>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--muted)]">{pedido.data}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${pedido.status === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {pedido.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-[var(--foreground)]">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}