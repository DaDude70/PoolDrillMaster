
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MousePointer, 
  Circle, 
  Square, 
  Minus, 
  Ruler, 
  Target,
  Undo,
  Redo,
  Save,
  FolderOpen,
  Play
} from 'lucide-react';
import { Tool } from '@/components/BilliardEditor';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FloatingToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onOpenLibrary?: () => void;
  onProject?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const FloatingToolbar = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onSave,
  onOpenLibrary,
  onProject,
  canUndo = false,
  canRedo = false,
}: FloatingToolbarProps) => {
  const tools = [
    { id: 'select' as Tool, label: 'Select', icon: MousePointer, shortcut: 'V' },
    { id: 'ball' as Tool, label: 'Place Ball', icon: Circle, shortcut: 'B' },
    { id: 'straightLine' as Tool, label: 'Line', icon: Minus, shortcut: 'L' },
    { id: 'circle' as Tool, label: 'Circle', icon: Circle, shortcut: 'C' },
    { id: 'rectangle' as Tool, label: 'Rectangle', icon: Square, shortcut: 'R' },
    { id: 'alignmentTool' as Tool, label: 'Alignment', icon: Ruler, shortcut: 'A' },
    { id: 'trainingAid' as Tool, label: 'Training Aid', icon: Target, shortcut: 'T' },
  ];

  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/80 backdrop-blur-lg border-border/50 shadow-2xl">
      <div className="flex items-center gap-1 p-2">
        {/* Tool Selection */}
        <div className="flex items-center gap-1 pr-2 border-r border-border/30">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onToolChange(tool.id)}
                    className={`h-9 w-9 p-0 transition-all duration-200 ${
                      isActive 
                        ? 'scale-105 shadow-md' 
                        : 'hover:scale-105 hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-medium">{tool.label}</div>
                    <div className="text-xs text-muted-foreground">Press {tool.shortcut}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* History Controls */}
        <div className="flex items-center gap-1 px-2 border-r border-border/30">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105"
              >
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div className="font-medium">Undo</div>
                <div className="text-xs text-muted-foreground">Ctrl+Z</div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div className="font-medium">Redo</div>
                <div className="text-xs text-muted-foreground">Ctrl+Y</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 pl-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105"
              >
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div className="font-medium">Save Drill</div>
                <div className="text-xs text-muted-foreground">Ctrl+S</div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenLibrary}
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105"
              >
                <FolderOpen className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div className="font-medium">Drill Library</div>
                <div className="text-xs text-muted-foreground">Ctrl+O</div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onProject}
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105"
              >
                <Play className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div className="font-medium">Project Mode</div>
                <div className="text-xs text-muted-foreground">Ctrl+P</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};
