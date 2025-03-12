import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, CollapsedSidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const cookiesStore = await cookies();
    const defaultOpen = cookiesStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="w-full">
                <div className="p-2">
                    <CollapsedSidebarTrigger />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}
