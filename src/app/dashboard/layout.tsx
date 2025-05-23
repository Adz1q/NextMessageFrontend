import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, CollapsedSidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const session: Session | null = await auth();
    const cookiesStore = await cookies();
    const defaultOpen = cookiesStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar session={session} />
            <main className="flex flex-col max-h-full w-full">
                <CollapsedSidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
