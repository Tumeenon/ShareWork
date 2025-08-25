import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-surface-dark border-b border-border-dark px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary" data-testid="header-title">
              ShareWork
            </h1>
            <p className="text-sm text-subtle" data-testid="header-subtitle">
              Freelance Marketplace Platform
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1 flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm text-accent font-medium" data-testid="status-indicator">
              Database Setup
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 hover:bg-surface-dark rounded-lg transition-colors"
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4 text-subtle" />
          </Button>
        </div>
      </div>
    </header>
  );
}
