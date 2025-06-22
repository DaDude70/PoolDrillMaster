
import React from 'react';
import { MousePointer, Circle, Square, Minus, Ruler, Target, ArrowUpRight, CircleDot } from 'lucide-react';
import { Tool } from './BilliardEditor';
import { ToolButton } from './modern/ToolButton';

interface ToolPaletteProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export const ToolPalette = ({ activeTool, onToolChange }: ToolPaletteProps) => {
  const tools = [
    { id: 'select' as Tool, label: 'Select', icon: MousePointer },
    { id: 'ball' as Tool, label: 'Place Ball', icon: Circle },
    { id: 'straightLine' as Tool, label: 'Straight Line', icon: Minus },
    { id: 'arrowLine' as Tool, label: 'Arrow Line', icon: ArrowUpRight },
    { id: 'circle' as Tool, label: 'Circle Area', icon: Circle },
    { id: 'rectangle' as Tool, label: 'Rectangle Area', icon: Square },
    { id: 'alignmentTool' as Tool, label: 'Alignment Tool', icon: Ruler },
    { id: 'trainingAid' as Tool, label: 'Training Aid (3)', icon: Target },
    { id: 'trainingAid4' as Tool, label: 'Training Aid (4)', icon: Target },
    { id: 'trainingAid5' as Tool, label: 'Training Aid (5)', icon: Target },
    { id: 'targetCircle' as Tool, label: 'Target Circle', icon: CircleDot },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-2">
      {tools.map((tool) => (
        <div key={tool.id} className="flex flex-col items-center">
          <ToolButton
            icon={tool.icon}
            label={tool.label}
            isActive={activeTool === tool.id}
            onClick={() => onToolChange(tool.id)}
            size="icon"
            variant="outline"
          />
          <span className="text-xs text-muted-foreground mt-1 text-center leading-tight">
            {tool.label}
          </span>
        </div>
      ))}
    </div>
  );
};
