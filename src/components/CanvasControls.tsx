
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface CanvasControlsProps {
  canvas: FabricCanvas | null;
}

export const CanvasControls = ({ canvas }: CanvasControlsProps) => {
  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#8B0000';
    canvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const saveProject = () => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    localStorage.setItem('billiard-drill', json);
    toast.success("Drill saved successfully!");
  };

  const loadProject = () => {
    if (!canvas) return;
    const saved = localStorage.getItem('billiard-drill');
    if (saved) {
      canvas.loadFromJSON(saved, () => {
        canvas.renderAll();
        toast.success("Drill loaded successfully!");
      });
    } else {
      toast.error("No saved drill found!");
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={saveProject} variant="outline" size="sm">
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
      <Button onClick={loadProject} variant="outline" size="sm">
        <FolderOpen className="w-4 h-4 mr-2" />
        Load
      </Button>
      <Button onClick={clearCanvas} variant="outline" size="sm">
        <Trash2 className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  );
};
