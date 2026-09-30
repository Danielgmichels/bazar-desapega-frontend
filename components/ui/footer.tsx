import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] mt-auto">
            {/* Links Principais */}
            <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Marca e Descrição */}
                    <div className="flex flex-col gap-3 md:col-span-1">
                        <Link href="/" className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            bazar<span className="text-[var(--accent)]">.desapega</span>
                        </Link>
                        <p className="text-xs leading-relaxed text-[var(--muted)]">
                            Moda circular com significado. Dando uma segunda vida a peças de qualidade com curadoria transparente.
                        </p>
                    </div>

                    {/* Exploração */}
                    <div className="flex flex-col gap-2">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">Explorar</h5>
                        <ul className="flex flex-col gap-2 text-sm text-[var(--muted)]">
                            <li>
                                <Link href="/produtos" className="transition-colors hover:text-[var(--accent)]">
                                    Todas as Peças
                                </Link>
                            </li>
                            <li>
                                <Link href="/produtos?tipo=4" className="transition-colors hover:text-[var(--accent)]">
                                    Casacos & Jaquetas
                                </Link>
                            </li>
                            <li>
                                <Link href="/produtos?tipo=3" className="transition-colors hover:text-[var(--accent)]">
                                    Vestidos
                                </Link>
                            </li>
                            <li>
                                <Link href="/produtos?tipo=2" className="transition-colors hover:text-[var(--accent)]">
                                    Calças & Jeans
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Minha Conta & Ajuda */}
                    <div className="flex flex-col gap-2">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">Atendimento</h5>
                        <ul className="flex flex-col gap-2 text-sm text-[var(--muted)]">
                            <li>
                                <Link href="/minha-conta/pedidos" className="transition-colors hover:text-[var(--accent)]">
                                    Meus Pedidos
                                </Link>
                            </li>
                            <li>
                                <Link href="/minha-conta/dados" className="transition-colors hover:text-[var(--accent)]">
                                    Minha Conta
                                </Link>
                            </li>
                            <li>
                                <span className="cursor-default text-xs text-[var(--muted)]">
                                    Dúvidas: suporte@bazardesapega.com.br
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Transparência e Acesso */}
                    <div className="flex flex-col gap-2">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">Políticas</h5>
                        <ul className="flex flex-col gap-2 text-sm text-[var(--muted)]">
                            <li>
                                <span className="cursor-default text-xs text-[var(--muted)]">
                                    Peças de segunda mão inspecionadas individualmente.
                                </span>
                            </li>
                            <li>
                                <span className="cursor-default text-xs text-[var(--muted)]">
                                    Retiradas mediante agendamento após confirmação de pagamento.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sub-footer com Copyright e Acesso Administrativo Discreto */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] pt-6 sm:flex-row">
                    <p className="text-xs text-[var(--muted)]">
                        &copy; {new Date().getFullYear()} Bazar Desapega. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                        <Link href="/admin/login" className="transition-colors hover:text-[var(--foreground)] opacity-60 hover:opacity-100">
                            Acesso Administrativo
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

