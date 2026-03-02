"use client";

import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { LucideIcon, CircleUserRound, CreditCard, ReceiptText, Settings, LogOut } from "lucide-react";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
  user?: any;
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
};

const PROFILE_ITEMS: MenuItem[] = [
  { label: "My Profile", icon: CircleUserRound },
  { label: "My Subscription", icon: CreditCard },
  { label: "My Invoice", icon: ReceiptText },
];

const SETTINGS_ITEMS: MenuItem[] = [
  { label: "Account Settings", icon: Settings },
];

const LOGOUT_ITEM: MenuItem = {
  label: "Signout",
  icon: LogOut,
  destructive: true,
};

const itemClass =
  "p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2";

const UserDropdown = ({ trigger, defaultOpen, align = "end", user }: Props) => {
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : 'https://images.shadcnspace.com/assets/profiles/user-11.jpg';
    
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-56 rounded-2xl data-open:slide-in-from-bottom-20 data-closed:slide-out-to-bottom-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          {/* User Info */}
          <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
            <div className="relative">
              <Avatar className="data-[size=lg]:size-8">
                <AvatarImage
                  src={avatarUrl}
                  alt={user?.username || "David McMichael"}
                />
                <AvatarFallback>{user?.username ? user.username.substring(0, 2).toUpperCase() : "DM"}</AvatarFallback>
              </Avatar>
              <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
            </div>

            <div className="flex flex-col">
              <span className="text-popover-foreground text-sm font-medium">
                {user?.username || "David McMichael"}
              </span>
              <span className="text-muted-foreground text-sm">
                Discord User
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Main Links */}
          <DropdownMenuGroup>
            {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass}>
                <Icon size={20} />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Settings */}
          <DropdownMenuGroup>
            {SETTINGS_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass}>
                <Icon size={20} />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem className={`${itemClass} text-red-500 focus:text-red-500`} onClick={() => window.location.href = '/api/auth/logout'}>
            <LOGOUT_ITEM.icon size={20} />
            <span>{LOGOUT_ITEM.label}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
