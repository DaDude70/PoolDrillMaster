import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Maximize, RotateCcw, MinusIcon, PlusIcon } from 'lucide-react';
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { DrillData } from '@/types/drill';

// Extend FabricObject to include our custom properties
interface ExtendedFabricObject extends FabricObject {
  originalLeft?: number;
  originalTop?: number;
  originalScaleX?: number;
  originalScaleY?: number;
}

interface DrillProjectionProps {
  drill: DrillData;
  onExit: () => void;
}

export const DrillProjection = ({ drill, onExit }: DrillProjectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<'black' | 'white' | 'green'>('black');
  const [zoom, setZoom] = useState(1);

  const scaleAndCenterDrill = (projectionCanvas: FabricCanvas) => {
    const objects = projectionCanvas.getObjects() as ExtendedFabricObject[];
    if (objects.length === 0) return;

    // Get current screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Calculate the bounding box of all objects
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
    
    // Calculate scale to fit screen with 10% padding
    const scaleX = (screenWidth * 0.8) / contentWidth;
    const scaleY = (screenHeight * 0.8) / contentHeight;
    const baseScale = Math.min(scaleX, scaleY);
    const finalScale = baseScale * zoom;
    
    // Calculate center position
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const contentCenterX = minX + contentWidth / 2;
    const contentCenterY = minY + contentHeight / 2;
    
    // Apply scaling and centering to all objects
    objects.forEach(obj => {
      // Store original position and scale if not already stored
      if (!obj.originalLeft) {
        obj.originalLeft = obj.left;
        obj.originalTop = obj.top;
        obj.originalScaleX = obj.scaleX || 1;
        obj.originalScaleY = obj.scaleY || 1;
      }
      
      // Apply scaling
      obj.scaleX = (obj.originalScaleX || 1) * finalScale;
      obj.scaleY = (obj.originalScaleY || 1) * finalScale;
      
      // Calculate new position relative to content center
      const relativeX = (obj.originalLeft || 0) - contentCenterX;
      const relativeY = (obj.originalTop || 0) - contentCenterY;
      
      // Position relative to screen center
      obj.left = centerX + relativeX * finalScale;
      obj.top = centerY + relativeY * finalScale;
      
      obj.setCoords();
    });
    
    projectionCanvas.renderAll();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new canvas for projection
    const projectionCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#8B0000',
      selection: false,
      interactive: false,
    });

    fabricCanvasRef.current = projectionCanvas;

    // Load the drill data
    if (drill.canvasData) {
      projectionCanvas.loadFromJSON(drill.canvasData, () => {
        scaleAndCenterDrill(projectionCanvas);
      });
    }

    const handleResize = () => {
      projectionCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Rescale and recenter after resize
      if (drill.canvasData) {
        scaleAndCenterDrill(projectionCanvas);
      }
    };

    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      // Small delay to ensure dimensions are updated after fullscreen change
      setTimeout(() => {
        handleResize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      projectionCanvas.dispose();
    };
  }, [drill, zoom]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      const bgColor = backgroundColor === 'black' ? '#000000' : 
                     backgroundColor === 'white' ? '#ffffff' : '#1f4e3d';
      fabricCanvasRef.current.backgroundColor = bgColor;
      fabricCanvasRef.current.renderAll();
    }
  }, [backgroundColor]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      scaleAndCenterDrill(fabricCanvasRef.current);
    }
  }, [zoom]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'b' || e.key === 'B') {
        setBackgroundColor(prev => 
          prev === 'black' ? 'white' : prev === 'white' ? 'green' : 'black'
        );
      } else if (e.key === '+' || e.key === '=') {
        setZoom(prev => Math.min(prev + 0.1, 3));
      } else if (e.key === '-') {
        setZoom(prev => Math.max(prev - 0.1, 0.5));
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onExit]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'white': return 'bg-white';
      case 'green': return 'bg-green-800';
      default: return 'bg-black';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${getBackgroundClass()}`}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
          className="bg-gray-600 hover:bg-gray-700 text-white"
          size="sm"
        >
          <MinusIcon className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}
          className="bg-gray-600 hover:bg-gray-700 text-white"
          size="sm"
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => setBackgroundColor(prev => 
            prev === 'black' ? 'white' : prev === 'white' ? 'green' : 'black'
          )}
          className="bg-gray-600 hover:bg-gray-700 text-white"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {backgroundColor === 'black' ? 'Black' : backgroundColor === 'white' ? 'White' : 'Green'}
        </Button>
        
        <Button
          onClick={toggleFullscreen}
          className="bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          <Maximize className="w-4 h-4 mr-2" />
          {isFullscreen ? 'Exit' : 'Full'} Screen
        </Button>
        
        <Button
          onClick={onExit}
          className="bg-red-600 hover:bg-red-700"
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Exit
        </Button>
      </div>
      
      <canvas 
        ref={canvasRef}
        className="w-full h-full cursor-none"
        style={{ display: 'block' }}
      />
      
      <div className={`absolute bottom-4 left-4 text-sm ${backgroundColor === 'white' ? 'text-black' : 'text-white'}`}>
        <div className="font-medium">{drill.name}</div>
        <div className="text-xs opacity-75">{drill.description}</div>
        <div className="text-xs opacity-50 mt-2">
          ESC: Exit • F: Fullscreen • B: Background • +/-: Zoom ({Math.round(zoom * 100)}%)
        </div>
      </div>
    </div>
  );
};
