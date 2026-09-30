import React from "react";
import { OrderStatus } from "@/contracts/order";
import { Clock, Package, CheckCircle2, Truck, Check, XCircle, CreditCard } from "lucide-react";

interface OrderStatusBadgeProps {
    status: OrderStatus | string;
    showIcon?: boolean;
    className?: string;
}

export function OrderStatusBadge({ status, showIcon = true, className = "" }: OrderStatusBadgeProps) {
    let colorClass = "bg-neutral-100 text-neutral-700 border-neutral-200";
    let Icon = Clock;

    switch (status) {
        case "Aguardando Pagamento":
            colorClass = "bg-amber-50 text-amber-800 border-amber-200";
            Icon = Clock;
            break;
        case "Pagamento Aprovado":
            colorClass = "bg-teal-50 text-teal-800 border-teal-200";
            Icon = CreditCard;
            break;
        case "Em Separação":
            colorClass = "bg-blue-50 text-blue-800 border-blue-200";
            Icon = Package;
            break;
        case "Pronto para Retirada":
            colorClass = "bg-purple-50 text-purple-800 border-purple-200";
            Icon = CheckCircle2;
            break;
        case "Enviado":
            colorClass = "bg-indigo-50 text-indigo-800 border-indigo-200";
            Icon = Truck;
            break;
        case "Entregue":
        case "Finalizado":
            colorClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
            Icon = Check;
            break;
        case "Cancelado":
            colorClass = "bg-red-50 text-red-700 border-red-200";
            Icon = XCircle;
            break;
        default:
            colorClass = "bg-neutral-100 text-neutral-700 border-neutral-200";
            Icon = Clock;
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className}`}
        >
            {showIcon && <Icon className="h-3.5 w-3.5" />}
            {status}
        </span>
    );
}

