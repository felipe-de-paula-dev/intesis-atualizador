"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/appidebar";
import { ModificarAtualizacao } from "@/components/pages/modificar-atualizacoes";
import { ClientOnly } from "@/components/ui/clientonly";

export default function Home() {
  return (
  <div className="flex min-h-screen w-full font-sans">
    <div className="flex bg-slate-50 w-full items-start justify-center">
      <ModificarAtualizacao />
    </div>
  </div>
  );
}
