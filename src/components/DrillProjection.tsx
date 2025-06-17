
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Maximize, RotateCcw, MinusIcon, PlusIcon, Eye, EyeOff } from 'lucide-react';
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { DrillData } from '@/types/drill';

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
  const [cleanView, setCleanView] = useState(false);

  // Original canvas dimensions from the editor
  const ORIGINAL_WIDTH = 900;
  const ORIGINAL_HEIGHT = 450;

  const convertObjectsToTurquoise = (canvas: FabricCanvas) => {
    const turquoise = '#00CED1';
    
    canvas.getObjects().forEach((obj: FabricObject) => {
      // Skip billiard table background elements
      if (obj.name === 'billiard-table' || obj.name === 'table-felt') {
        if (cleanView) {
          obj.visible = false;
        } else {
          obj.visible = true;
        }
        return;
      }

      // Make object visible and set turquoise color
      obj.visible = true;
      
      if (obj.type === 'circle' || obj.type === 'rect' || obj.type === 'polygon') {
        obj.set({
          fill: turquoise,
          stroke: turquoise,
        });
      } else if (obj.type === 'line' || obj.type === 'path') {
        obj.set({
          stroke: turquoise,
          strokeWidth: Math.max(obj.strokeWidth || 2, 3), // Make lines more visible
        });
      } else if (obj.type === 'text' || obj.type === 'i-text') {
        obj.set({
          fill: turquoise,
          stroke: turquoise,
        });
      } else if (obj.type === 'group') {
        // Handle grouped objects
        (obj as any).getObjects().forEach((groupObj: FabricObject) => {
          groupObj.set({
            fill: turquoise,
            stroke: turquoise,
          });
        });
      }
    });
    
    canvas.renderAll();
  };

  const updateProjectionView = (projectionCanvas: FabricCanvas) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Calculate the scale to fit the original canvas dimensions into the screen
    const scaleX = screenWidth / ORIGINAL_WIDTH;
    const scaleY = screenHeight / ORIGINAL_HEIGHT;
    const baseScale = Math.min(scaleX, scaleY) * 0.9; // 90% to add padding
    const finalScale = baseScale * zoom;
    
    // Calculate the viewport transformation
    const scaledWidth = ORIGINAL_WIDTH * finalScale;
    const scaledHeight = ORIGINAL_HEIGHT * finalScale;
    const offsetX = (screenWidth - scaledWidth) / 2;
    const offsetY = (screenHeight - scaledHeight) / 2;
    
    // Apply viewport transformation to the entire canvas
    projectionCanvas.setViewportTransform([
      finalScale, 0, 0, finalScale, offsetX, offsetY
    ]);
    
    projectionCanvas.renderAll();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new canvas for projection
    const projectionCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: backgroundColor === 'black' ? '#000000' : 
                     backgroundColor === 'white' ? '#ffffff' : '#1f4e3d',
      selection: false,
      interactive: false,
    });

    fabricCanvasRef.current = projectionCanvas;

    // Load the drill data
    if (drill.canvasData) {
      projectionCanvas.loadFromJSON(drill.canvasData, () => {
        // Convert objects to turquoise and handle clean view
        convertObjectsToTurquoise(projectionCanvas);
        
        // Update the projection view after loading
        setTimeout(() => {
          updateProjectionView(projectionCanvas);
        }, 100);
      });
    }

    const handleResize = () => {
      projectionCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Reapply the viewport transformation after resize
      setTimeout(() => {
        updateProjectionView(projectionCanvas);
      }, 100);
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
  }, [drill, cleanView]);

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
      updateProjectionView(fabricCanvasRef.current);
    }
  }, [zoom]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      convertObjectsToTurquoise(fabricCanvasRef.current);
    }
  }, [cleanView]);

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
      } else if (e.key === 'c' || e.key === 'C') {
        setCleanView(prev => !prev);
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
          onClick={() => setCleanView(prev => !prev)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          size="sm"
        >
          {cleanView ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {cleanView ? 'Show' : 'Hide'} Table
        </Button>
        
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
          ESC: Exit • F: Fullscreen • B: Background • C: Clean View • +/-: Zoom ({Math.round(zoom * 100)}%)
        </div>
      </div>
    </div>
  );
};
