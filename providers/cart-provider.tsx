"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Produto } from "@/contracts/product";

interface CartContextType {
    items: Produto[];
    addItem: (produto: Produto) => boolean;
    removeItem: (id_produto: string | number) => void;
    clearCart: () => void;
    isInCart: (id_produto: string | number) => boolean;
    total: number;
    count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bazar_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Produto[]>([]);
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch {
            // ignore
        }
        setHasHydrated(true);
    }, []);

    useEffect(() => {
        if (!hasHydrated) return;
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore
        }
    }, [items, hasHydrated]);

    const isInCart = (id_produto: string | number) => {
        return items.some((item) => String(item.id_produto ?? item.id) === String(id_produto));
    };

    const addItem = (produto: Produto): boolean => {
        const prodId = produto.id_produto ?? produto.id;
        if (!prodId || isInCart(prodId)) {
            return false;
        }
        const itemNormalizado: Produto = {
            ...produto,
            id_produto: prodId,
            id: prodId,
        };
        setItems((prev) => [...prev, itemNormalizado]);
        return true;
    };

    const removeItem = (id_produto: string | number) => {
        setItems((prev) => prev.filter((item) => String(item.id_produto ?? item.id) !== String(id_produto)));
    };


    const clearCart = () => {
        setItems([]);
        if (typeof window !== "undefined") {
            try {
                localStorage.removeItem(CART_STORAGE_KEY);
            } catch {
                // ignore
            }
        }
    };

    const total = items.reduce((acc, item) => acc + (Number(item.preco_venda) || 0), 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                clearCart,
                isInCart,
                total,
                count: items.length,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart deve ser utilizado dentro de um CartProvider");
    }
    return context;
}

