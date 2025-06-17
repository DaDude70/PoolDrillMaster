
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ModernBallPalette } from './ModernBallPalette';
import { DrillLibrary } from './DrillLibrary';
import { DrillData } from '@/types/drill';
import { Separator } from '@/components/ui/separator';
import { Palette, Library, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  selectedBallNumber: number;
  onBallNumberChange: (ballNumber: number) => void;
  onSelectDrill: (drill: DrillData) => void;
  onProjectDrill: (drill: DrillData) => void;
  onNewDrill: () => void;
}

export const AppSidebar = ({
  selectedBallNumber,
  onBallNumberChange,
  onSelectDrill,
  onProjectDrill,
  onNewDrill,
}: AppSidebarProps) => {
  const { user, signOut } = useAuth();

  return (
    <Sidebar className="border-r border-border/40 bg-background/60 backdrop-blur-lg">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">🎱</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">Training Studio</h2>
            <p className="text-xs text-muted-foreground">Professional Drill Editor</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col">
        <SidebarGroup className="flex-none">
          <SidebarGroupLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground px-2">
            <Palette className="w-4 h-4" />
            Ball Selection
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ModernBallPalette
              selectedNumber={selectedBallNumber}
              onNumberChange={onBallNumberChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2 mx-4 bg-border/30" />

        <SidebarGroup className="flex-1 min-h-0">
          <SidebarGroupLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground px-2">
            <Library className="w-4 h-4" />
            Drill Management
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 min-h-0">
            <DrillLibrary
              onSelectDrill={onSelectDrill}
              onProjectDrill={onProjectDrill}
              onNewDrill={onNewDrill}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter className="border-t border-border/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="h-6 w-6 p-0 hover:bg-red-500/10 hover:text-red-600"
            >
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
