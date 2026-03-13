import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/80 z-50 shadow-sm">
      <div className="h-full px-3 sm:px-4 lg:px-8 flex items-center justify-between">
        {/* Logo - Mobile: center-aligned when sidebar closed */}
        <div className="flex items-center gap-2 sm:gap-3 lg:pl-64">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base sm:text-lg">S</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            StudyOS
          </h1>
        </div>

        {/* User Profile - Far Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 sm:gap-3 h-9 sm:h-10 px-2 sm:px-3 hover:bg-gray-100/80 transition-smooth rounded-lg group"
              >
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-500 leading-tight">
                    {user?.email}
                  </span>
                </div>
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-gray-200 shadow-sm ring-2 ring-transparent group-hover:ring-violet-200 transition-all">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 sm:w-72 shadow-premium-lg mr-2 sm:mr-0">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="w-12 h-12 border-2 border-gray-200">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-900 leading-tight mb-1">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate('/settings')} 
                className="cursor-pointer py-2.5 transition-smooth focus:bg-gray-100"
              >
                <SettingsIcon className="w-4 h-4 mr-3 text-gray-600" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50 py-2.5 transition-smooth"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
