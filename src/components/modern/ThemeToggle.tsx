
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ThemeToggle = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'system') return <Monitor className="w-4 h-4" />;
    return actualTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105"
        >
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-lg border-border/50">
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
          <Sun className="w-4 h-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
          <Monitor className="w-4 h-4 mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
