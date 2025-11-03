export const metadata = {
  title: "Austral CRM - Principal",
  description: "Interfaz principal de Austral CRM",
};

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
  }) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header solo visible en mobile para el trigger */}
        <header className="flex items-center h-12 px-2 md:hidden border-b border-gray-200 bg-white/80 backdrop-blur z-20 sticky top-0">
          <SidebarTrigger className="mr-2" />
          <span className="font-semibold text-base">Austral CRM</span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}