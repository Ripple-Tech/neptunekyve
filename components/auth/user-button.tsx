"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback, } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { LucidePanelLeftClose } from "lucide-react";

export const UserButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
               <AvatarImage src={user?.image || ""} />
               <AvatarFallback className="bg-lime-500">
                 <FaUser className="text-white"/>
               </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 m-2 space-x-2"  align="end">
            <LogoutButton>
              <DropdownMenuItem>
                 <LucidePanelLeftClose className="h-6 w-6 mr-2"/> Logout
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
    );
};