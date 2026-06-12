"use client";

import { ToastProvider } from "@/components/admin/Toast";
import { ReactNode } from "react";

export function AdminClientWrapper({ children }: { children: ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>;
}
