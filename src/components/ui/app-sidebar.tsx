import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Search, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "./button"
  
  export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center justify-between gap-2 w-full">
                <SidebarTrigger />
                <div className="text-muted-foreground text-md ml-auto mr-auto font-bold">NextMessage</div>
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
                <Link href="/dashboard/settings">
                    <Button variant="ghost" size="icon" className="w-10 h-10">
                        <Settings />
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="w-10 h-10">
                        <Search />    
                    </Button>
                </Link>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
    )
}
