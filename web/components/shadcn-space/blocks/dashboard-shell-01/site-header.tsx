import { SidebarTrigger } from "@/components/ui/sidebar"
import UserDropdown from "@/components/shadcn-space/blocks/dashboard-shell-01/user-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationDropdown from "@/components/shadcn-space/blocks/dashboard-shell-01/notification-dropdown";
import { BellRing, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function SiteHeader({ user }: { user?: any }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
        {/* - search with subtle styling - \\ */}
        <InputGroup className="w-64">
          <InputGroupInput placeholder="Search..." className="text-sm placeholder:text-muted-foreground/50" />
          <InputGroupAddon>
            <SearchIcon className="size-3.5 text-muted-foreground/50" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex items-center gap-3">
        <NotificationDropdown
          defaultOpen={false}
          align="center"
          trigger={
            <div className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1">
              <BellRing className="size-4" />
            </div>
          }
        />
        <UserDropdown
          user={user}
          defaultOpen={false}
          align="center"
          trigger={
            <div className="rounded-full">
              <Avatar className="size-8 cursor-pointer">
                <AvatarImage
                  src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://images.shadcnspace.com/assets/profiles/user-11.jpg"}
                  alt={user?.username || "David McMichael"}
                />
                <AvatarFallback>{user?.username ? user.username.substring(0, 2).toUpperCase() : "DM"}</AvatarFallback>
              </Avatar>
            </div>
          }
        />
      </div>
    </div>
  )
}
