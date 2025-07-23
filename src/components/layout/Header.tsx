import { ArrowLeft, Search, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showAdd?: boolean;
  onBack?: () => void;
  onAdd?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export function Header({
  title,
  showBack = false,
  showSearch = false,
  showAdd = false,
  onBack,
  onAdd,
  searchValue = "",
  onSearchChange,
  notificationCount = 0,
  onNotificationClick
}: HeaderProps) {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        )}
        
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={onNotificationClick}>
            <Bell className="h-4 w-4" />
          </Button>
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-urgent text-urgent-foreground text-xs">
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </div>

        {showAdd && (
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        )}
      </div>
    </header>
  );
}