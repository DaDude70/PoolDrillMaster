
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'default' | 'icon';
}

export const ToolButton = ({
  icon: Icon,
  label,
  shortcut,
  isActive = false,
  onClick,
  disabled = false,
  variant = 'ghost',
  size = 'sm'
}: ToolButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "default" : variant}
          size={size}
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "relative overflow-hidden transition-all duration-200 shrink-0",
            size === 'icon' ? 'h-10 w-10 p-0' : 'h-9 w-9 p-0',
            isActive && "btn-3d-active shadow-lg",
            !isActive && "btn-3d hover:shadow-md",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Icon className="w-4 h-4" />
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <div className="font-medium">{label}</div>
          {shortcut && (
            <div className="text-xs text-muted-foreground">Press {shortcut}</div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
