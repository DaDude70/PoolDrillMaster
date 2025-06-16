
import React from 'react';
import { Button } from '@/components/ui/button';
import { Canvas as FabricCanvas } from 'fabric';
import { RotateCcw, ZoomIn, ZoomOut, Move, MousePointer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CanvasControlsProps {
  canvas: FabricCanvas | null;
}

export const CanvasControls = ({ canvas }: CanvasControlsProps) => {
  const handleZoomIn = () => {
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(Math.min(zoom * 1.1, 3));
  };

  const handleZoomOut = () => {
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(Math.max(zoom * 0.9, 0.1));
  };

  const handleResetZoom = () => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.renderAll();
  };

  const handleCenterView = () => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    if (objects.length === 0) return;

    // Calculate bounding box of all objects
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    objects.forEach(obj => {
      const bounds = obj.getBoundingRect();
      minX = Math.min(minX, bounds.left);
      minY = Math.min(minY, bounds.top);
      maxX = Math.max(maxX, bounds.left + bounds.width);
      maxY = Math.max(maxY, bounds.top + bounds.height);
    });
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const contentCenterX = minX + contentWidth / 2;
    const contentCenterY = minY + contentHeight / 2;
    
    // Get canvas center
    const canvasCenterX = canvas.width! / 2;
    const canvasCenterY = canvas.height! / 2;
    
    // Calculate translation needed to center content
    const deltaX = canvasCenterX - contentCenterX;
    const deltaY = canvasCenterY - contentCenterY;
    
    // Apply translation with proper TMat2D format
    const vpt = canvas.viewportTransform?.slice() || [1, 0, 0, 1, 0, 0];
    if (vpt.length >= 6) {
      vpt[4] = deltaX;
      vpt[5] = deltaY;
      canvas.setViewportTransform(vpt as [number, number, number, number, number, number]);
    }
    canvas.renderAll();
  };

  const handleClear = () => {
    if (!canvas) return;
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      canvas.clear();
      canvas.backgroundColor = '#8B0000';
      canvas.renderAll();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom In</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom Out</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-8 w-8 p-0"
          >
            <MousePointer className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset View</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCenterView}
            className="h-8 w-8 p-0"
          >
            <Move className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Center Content</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear Canvas</TooltipContent>
      </Tooltip>
    </div>
  );
};
