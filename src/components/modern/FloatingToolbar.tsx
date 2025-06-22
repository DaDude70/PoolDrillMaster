
import React from 'react';
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
  Play,
  ArrowUpRight,
  CircleDot
} from 'lucide-react';
import { Tool } from '@/components/BilliardEditor';
import { ToolButton } from './ToolButton';

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
    { id: 'arrowLine' as Tool, label: 'Arrow Line', icon: ArrowUpRight, shortcut: 'Shift+L' },
    { id: 'circle' as Tool, label: 'Circle', icon: Circle, shortcut: 'C' },
    { id: 'rectangle' as Tool, label: 'Rectangle', icon: Square, shortcut: 'R' },
    { id: 'alignmentTool' as Tool, label: 'Alignment', icon: Ruler, shortcut: 'A' },
    { id: 'trainingAid' as Tool, label: 'Training Aid (3)', icon: Target, shortcut: 'T' },
    { id: 'trainingAid4' as Tool, label: 'Training Aid (4)', icon: Target, shortcut: '4' },
    { id: 'trainingAid5' as Tool, label: 'Training Aid (5)', icon: Target, shortcut: '5' },
    { id: 'targetCircle' as Tool, label: 'Target Circle', icon: CircleDot, shortcut: 'G' },
  ];

  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/90 backdrop-blur-xl border-border/60 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-2 p-3 max-w-[90vw] overflow-x-auto scrollbar-thin">
        {/* Tool Selection */}
        <div className="flex items-center gap-1 pr-3 border-r border-border/40 min-w-0">
          {tools.map((tool) => (
            <ToolButton
              key={tool.id}
              icon={tool.icon}
              label={tool.label}
              shortcut={tool.shortcut}
              isActive={activeTool === tool.id}
              onClick={() => onToolChange(tool.id)}
            />
          ))}
        </div>

        {/* History Controls */}
        <div className="flex items-center gap-1 px-3 border-r border-border/40">
          <ToolButton
            icon={Undo}
            label="Undo"
            shortcut="Ctrl+Z"
            onClick={onUndo || (() => {})}
            disabled={!canUndo}
          />
          <ToolButton
            icon={Redo}
            label="Redo"
            shortcut="Ctrl+Y"
            onClick={onRedo || (() => {})}
            disabled={!canRedo}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 pl-3">
          <ToolButton
            icon={Save}
            label="Save Drill"
            shortcut="Ctrl+S"
            onClick={onSave || (() => {})}
          />
          <ToolButton
            icon={FolderOpen}
            label="Drill Library"
            shortcut="Ctrl+O"
            onClick={onOpenLibrary || (() => {})}
          />
          <ToolButton
            icon={Play}
            label="Project Mode"
            shortcut="Ctrl+P"
            onClick={onProject || (() => {})}
          />
        </div>
      </div>
    </Card>
  );
};
