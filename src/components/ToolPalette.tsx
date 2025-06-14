
import React from 'react';
import { Button } from '@/components/ui/button';
import { MousePointer, Circle, Square, Minus } from 'lucide-react';
import { Tool } from './BilliardEditor';

interface ToolPaletteProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export const ToolPalette = ({ activeTool, onToolChange }: ToolPaletteProps) => {
  const tools = [
    { id: 'select' as Tool, label: 'Select', icon: MousePointer },
    { id: 'ball' as Tool, label: 'Place Ball', icon: Circle },
    { id: 'straightLine' as Tool, label: 'Straight Line', icon: Minus },
    { id: 'circle' as Tool, label: 'Circle Area', icon: Circle },
    { id: 'rectangle' as Tool, label: 'Rectangle Area', icon: Square },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="flex flex-col items-center justify-center h-16 p-2"
          >
            <Icon className="w-4 h-4 mb-1" />
            <span className="text-xs">{tool.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
