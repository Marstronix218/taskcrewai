import { User, Crown, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  user: {
    name: string;
    level: number;
  };
}

export const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold glow-text">ProductiveAI</h1>
              <p className="text-sm text-muted-foreground">Level up your day</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks, characters..."
                className="pl-10 bg-muted/50 border-border"
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-foreground">Welcome back,</p>
              <p className="text-sm glow-text font-semibold">
                Level {user.level} {user.name}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center border-2 border-primary/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};