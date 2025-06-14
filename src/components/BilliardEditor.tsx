
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Line, Path, Text, Group, Pattern, Shadow } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BallPalette } from './BallPalette';
import { ToolPalette } from './ToolPalette';
import { ProjectionMode } from './ProjectionMode';
import { Monitor, Edit3, Save, FolderOpen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export type Tool = 'select' | 'ball' | 'freeDraw' | 'straightLine' | 'circle' | 'rectangle';

export const BilliardEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedBallNumber, setSelectedBallNumber] = useState(1);
  const [isProjectionMode, setIsProjectionMode] = useState(false);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStartPoint, setLineStartPoint] = useState<{x: number, y: number} | null>(null);

  // Canvas dimensions matching pool table proportions (9-foot table)
  const canvasWidth = 900;
  const canvasHeight = 450;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#8B0000', // Dark red to simulate pool table felt
    });

    // Initialize the freeDrawingBrush properly for Fabric.js v6
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#FFFF00';
      canvas.freeDrawingBrush.width = 3;
    }

    // Draw table rails/borders
    const railWidth = 20;
    const topRail = new Rect({
      left: 0,
      top: 0,
      width: canvasWidth,
      height: railWidth,
      fill: '#4A4A4A',
      selectable: false,
      evented: false,
    });
    
    const bottomRail = new Rect({
      left: 0,
      top: canvasHeight - railWidth,
      width: canvasWidth,
      height: railWidth,
      fill: '#4A4A4A',
      selectable: false,
      evented: false,
    });
    
    const leftRail = new Rect({
      left: 0,
      top: 0,
      width: railWidth,
      height: canvasHeight,
      fill: '#4A4A4A',
      selectable: false,
      evented: false,
    });
    
    const rightRail = new Rect({
      left: canvasWidth - railWidth,
      top: 0,
      width: railWidth,
      height: canvasHeight,
      fill: '#4A4A4A',
      selectable: false,
      evented: false,
    });

    canvas.add(topRail, bottomRail, leftRail, rightRail);

    // Add pocket markers
    const pocketRadius = 15;
    const pocketPositions = [
      { x: railWidth, y: railWidth }, // Top left
      { x: canvasWidth / 2, y: railWidth }, // Top center
      { x: canvasWidth - railWidth, y: railWidth }, // Top right
      { x: railWidth, y: canvasHeight - railWidth }, // Bottom left
      { x: canvasWidth / 2, y: canvasHeight - railWidth }, // Bottom center
      { x: canvasWidth - railWidth, y: canvasHeight - railWidth }, // Bottom right
    ];

    pocketPositions.forEach(pos => {
      const pocket = new Circle({
        left: pos.x - pocketRadius,
        top: pos.y - pocketRadius,
        radius: pocketRadius,
        fill: '#000000',
        selectable: false,
        evented: false,
      });
      canvas.add(pocket);
    });

    // Add keyboard event listener for delete
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    setFabricCanvas(canvas);
    toast.success("Billiard table ready! Start creating your drill.");

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'freeDraw';
    
    // Check if freeDrawingBrush exists before accessing it
    if (activeTool === 'freeDraw' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = '#FFFF00';
      fabricCanvas.freeDrawingBrush.width = 3;
    }
  }, [activeTool, fabricCanvas]);

  const createBall = (x: number, y: number, ballNumber: number) => {
    if (!fabricCanvas) return;

    const ballRadius = 12;
    let ballColor = '#FFFFFF';
    let strokeColor = '#000000';
    let ballText = '';

    if (ballNumber === 0) {
      // Cue ball
      ballColor = '#FFFFFF';
      ballText = '';
    } else if (ballNumber >= 1 && ballNumber <= 7) {
      // Solid balls
      const solidColors = ['#FFFF00', '#0066FF', '#FF0000', '#800080', '#FF8C00', '#006400', '#8B0000'];
      ballColor = solidColors[ballNumber - 1];
      ballText = ballNumber.toString();
    } else if (ballNumber === 8) {
      // 8-ball
      ballColor = '#000000';
      ballText = '8';
    } else if (ballNumber >= 9 && ballNumber <= 15) {
      // Stripe balls
      const stripeColors = ['#FFFF00', '#0066FF', '#FF0000', '#800080', '#FF8C00', '#006400', '#8B0000'];
      const stripeIndex = ballNumber - 9;
      ballColor = '#FFFFFF';
      strokeColor = stripeColors[stripeIndex];
      ballText = ballNumber.toString();
    }

    const ball = new Circle({
      left: x - ballRadius,
      top: y - ballRadius,
      radius: ballRadius,
      fill: ballColor,
      stroke: strokeColor,
      strokeWidth: 2,
    });

    // Add stripe pattern for stripe balls
    if (ballNumber >= 9 && ballNumber <= 15) {
      const stripeColors = ['#FFFF00', '#0066FF', '#FF0000', '#800080', '#FF8C00', '#006400', '#8B0000'];
      const stripeIndex = ballNumber - 9;
      const stripeColor = stripeColors[stripeIndex];
      
      ball.set({
        fill: new Pattern({
          source: createStripePattern(stripeColor),
          repeat: 'repeat'
        })
      });
    }

    if (ballText) {
      const text = new Text(ballText, {
        left: x - 6, // Adjusted positioning for better centering
        top: y - 8,
        fontSize: 14, // Slightly larger font for better visibility
        fill: '#FFFFFF', // White text for all balls
        fontFamily: 'Arial Black', // Bolder font for better visibility
        fontWeight: 'bold',
        textAlign: 'center',
        selectable: false,
        evented: false,
        shadow: new Shadow({
          color: '#000000',
          blur: 1,
          offsetX: 1,
          offsetY: 1
        }), // Properly constructed Shadow object
      });
      
      const group = new Group([ball, text], {
        left: x - ballRadius,
        top: y - ballRadius,
      });
      
      fabricCanvas.add(group);
    } else {
      fabricCanvas.add(ball);
    }
  };

  const createStripePattern = (color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 24, 24);
    
    // Colored stripe with larger middle area
    ctx.fillStyle = color;
    ctx.fillRect(0, 5, 24, 14); // Larger middle stripe (from 5 to 19, total 14px out of 24px)
    
    return canvas;
  };

  const handleCanvasClick = (e: any) => {
    if (!fabricCanvas) return;

    const pointer = fabricCanvas.getPointer(e.e);
    
    if (activeTool === 'ball') {
      createBall(pointer.x, pointer.y, selectedBallNumber);
    } else if (activeTool === 'straightLine') {
      if (!isDrawingLine) {
        setLineStartPoint({ x: pointer.x, y: pointer.y });
        setIsDrawingLine(true);
      } else {
        const line = new Line([lineStartPoint!.x, lineStartPoint!.y, pointer.x, pointer.y], {
          stroke: '#FFFF00',
          strokeWidth: 3,
          selectable: true,
        });
        fabricCanvas.add(line);
        setIsDrawingLine(false);
        setLineStartPoint(null);
      }
    } else if (activeTool === 'circle') {
      const circle = new Circle({
        left: pointer.x - 25,
        top: pointer.y - 25,
        radius: 25,
        fill: 'transparent',
        stroke: '#00FFFF',
        strokeWidth: 3,
        selectable: true,
      });
      fabricCanvas.add(circle);
    } else if (activeTool === 'rectangle') {
      const rect = new Rect({
        left: pointer.x - 40,
        top: pointer.y - 30,
        width: 80,
        height: 60,
        fill: 'transparent',
        stroke: '#00FFFF',
        strokeWidth: 3,
        selectable: true,
      });
      fabricCanvas.add(rect);
    }
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.on('mouse:down', handleCanvasClick);

    return () => {
      fabricCanvas.off('mouse:down', handleCanvasClick);
    };
  }, [fabricCanvas, activeTool, selectedBallNumber, isDrawingLine, lineStartPoint]);

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    // Re-add table elements
    fabricCanvas.backgroundColor = '#8B0000';
    // Re-initialize table - you might want to extract this to a separate function
    window.location.reload(); // Quick solution, but you could optimize this
  };

  const saveProject = () => {
    if (!fabricCanvas) return;
    const json = JSON.stringify(fabricCanvas.toJSON());
    localStorage.setItem('billiard-drill', json);
    toast.success("Drill saved successfully!");
  };

  const loadProject = () => {
    if (!fabricCanvas) return;
    const saved = localStorage.getItem('billiard-drill');
    if (saved) {
      fabricCanvas.loadFromJSON(saved, () => {
        fabricCanvas.renderAll();
        toast.success("Drill loaded successfully!");
      });
    } else {
      toast.error("No saved drill found!");
    }
  };

  if (isProjectionMode) {
    return (
      <ProjectionMode 
        canvas={fabricCanvas} 
        onExit={() => setIsProjectionMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Pool Training Drill Editor</h1>
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
            <Button 
              onClick={() => setIsProjectionMode(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Project Mode
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                Tools
              </h3>
              <ToolPalette activeTool={activeTool} onToolChange={setActiveTool} />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Balls</h3>
              <BallPalette 
                selectedNumber={selectedBallNumber}
                onNumberChange={setSelectedBallNumber}
              />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Instructions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Select a tool and click on the table</p>
                <p>• For straight lines: click start, then end point</p>
                <p>• Use bright colors for projection visibility</p>
                <p>• Save your drills for later use</p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="p-4">
              <div className="flex justify-center">
                <canvas 
                  ref={canvasRef}
                  className="border-2 border-gray-300 rounded-lg shadow-lg"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
