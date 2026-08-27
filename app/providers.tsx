"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    // Criamos o QueryClient dentro de um useState para garantir que ele 
    // não seja recriado a cada renderização da página.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // Os dados ficam "frescos" por 5 minutos (evita requisições repetidas na API)
                        retry: 1, // Se a requisição falhar, tenta apenas mais 1 vez
                        refetchOnWindowFocus: false, // Não faz requisição nova só por mudar de aba no navegador
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}