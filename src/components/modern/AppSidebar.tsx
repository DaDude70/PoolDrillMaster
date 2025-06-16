
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernBallPalette } from './ModernBallPalette';
import { DrillManager } from '@/components/DrillManager';
import { DrillData } from '@/types/drill';
import { Lightbulb, Palette, FolderOpen } from 'lucide-react';

interface AppSidebarProps {
  selectedBallNumber: number;
  onBallNumberChange: (number: number) => void;
  showDrillManager: boolean;
  onSelectDrill: (drill: DrillData) => void;
  onProjectDrill: (drill: DrillData) => void;
  onNewDrill: () => void;
}

export const AppSidebar = ({
  selectedBallNumber,
  onBallNumberChange,
  showDrillManager,
  onSelectDrill,
  onProjectDrill,
  onNewDrill,
}: AppSidebarProps) => {
  return (
    <Sidebar className="border-r border-border/50 bg-background/60 backdrop-blur-sm">
      <SidebarHeader className="p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            🎱 Pool Trainer
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Professional Drill Editor</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-4">
        {showDrillManager ? (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-base font-semibold">
              <FolderOpen className="w-4 h-4" />
              Drill Library
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <DrillManager
                onSelectDrill={onSelectDrill}
                onProjectDrill={onProjectDrill}
                onNewDrill={onNewDrill}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-base font-semibold">
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

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-base font-semibold">
                <Lightbulb className="w-4 h-4" />
                Quick Tips
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">💡 Pro Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2 text-muted-foreground">
                    <p>• Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">V</kbd> for select tool</p>
                    <p>• Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">B</kbd> to place balls</p>
                    <p>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">L</kbd> for drawing lines</p>
                    <p>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+S</kbd> to save</p>
                    <p>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Z</kbd> to undo</p>
                    <p>• Use bright colors for projection</p>
                  </CardContent>
                </Card>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-center text-xs text-muted-foreground">
          <p>Professional Billiard Training</p>
          <p className="text-xs opacity-70">v2.0 Enhanced Edition</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
