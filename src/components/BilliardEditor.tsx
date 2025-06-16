
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DrillProjection } from './DrillProjection';
import { SaveDrillDialog } from './SaveDrillDialog';
import { CanvasHandler } from './CanvasHandler';
import { BallCreator } from './BallCreator';
import { ShapeCreator } from './ShapeCreator';
import { TrainingAidCreator } from './TrainingAidCreator';
import { FloatingToolbar } from './modern/FloatingToolbar';
import { AppSidebar } from './modern/AppSidebar';
import { ThemeToggle } from './modern/ThemeToggle';
import { CanvasControls } from './modern/CanvasControls';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { DrillData } from '@/types/drill';
import { Settings } from 'lucide-react';

export type Tool = 'select' | 'ball' | 'straightLine' | 'circle' | 'rectangle' | 'alignmentTool' | 'trainingAid';

export const BilliardEditor = () => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedBallNumber, setSelectedBallNumber] = useState(1);
  const [projectionDrill, setProjectionDrill] = useState<DrillData | null>(null);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStartPoint, setLineStartPoint] = useState<{x: number, y: number} | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Canvas dimensions matching pool table proportions (9-foot table)
  const canvasWidth = 900;
  const canvasHeight = 450;

  // Keyboard shortcuts
  const shortcuts = [
    { key: 'v', callback: () => setActiveTool('select'), description: 'Select tool' },
    { key: 'b', callback: () => setActiveTool('ball'), description: 'Ball tool' },
    { key: 'l', callback: () => setActiveTool('straightLine'), description: 'Line tool' },
    { key: 'c', callback: () => setActiveTool('circle'), description: 'Circle tool' },
    { key: 'r', callback: () => setActiveTool('rectangle'), description: 'Rectangle tool' },
    { key: 'a', callback: () => setActiveTool('alignmentTool'), description: 'Alignment tool' },
    { key: 't', callback: () => setActiveTool('trainingAid'), description: 'Training aid tool' },
    { key: 's', ctrlKey: true, callback: () => setShowSaveDialog(true), description: 'Save drill' },
    { key: 'z', ctrlKey: true, callback: () => handleUndo(), description: 'Undo' },
    { key: 'y', ctrlKey: true, callback: () => handleRedo(), description: 'Redo' },
    { key: 'p', ctrlKey: true, callback: () => handleProjectCurrent(), description: 'Project current drill' },
  ];

  useKeyboardShortcuts(shortcuts);

  // Mock undo/redo handlers - you can implement proper history management
  const handleUndo = () => {
    // TODO: Implement proper undo functionality
    console.log('Undo action');
  };

  const handleRedo = () => {
    // TODO: Implement proper redo functionality
    console.log('Redo action');
  };

  const handleProjectCurrent = () => {
    if (!fabricCanvas) return;
    
    // Create a temporary drill from current canvas state
    const currentDrill: DrillData = {
      id: 'temp',
      name: 'Current Drill',
      description: 'Live projection of current drill',
      category: 'practice',
      canvasData: fabricCanvas.toJSON(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setProjectionDrill(currentDrill);
  };

  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = false;

    // Enable canvas panning with mouse
    let isPanning = false;
    let lastPoint: { x: number; y: number } | null = null;

    const handleMouseDown = (e: any) => {
      if (activeTool === 'select' && e.e.ctrlKey) {
        isPanning = true;
        lastPoint = { x: e.e.clientX, y: e.e.clientY };
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = false;
        fabricCanvas.discardActiveObject();
      }
    };

    const handleMouseMove = (e: any) => {
      if (isPanning && lastPoint) {
        const deltaX = e.e.clientX - lastPoint.x;
        const deltaY = e.e.clientY - lastPoint.y;
        
        const vpt = fabricCanvas.viewportTransform!.slice();
        vpt[4] += deltaX;
        vpt[5] += deltaY;
        
        fabricCanvas.setViewportTransform(vpt);
        lastPoint = { x: e.e.clientX, y: e.e.clientY };
      }
    };

    const handleMouseUp = () => {
      isPanning = false;
      lastPoint = null;
      fabricCanvas.selection = true;
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
    };
  }, [activeTool, fabricCanvas]);

  const handleCanvasClick = (e: any) => {
    if (!fabricCanvas) return;

    // Don't handle clicks if panning (Ctrl key pressed)
    if (e.e.ctrlKey) return;

    const pointer = fabricCanvas.getPointer(e.e);
    
    if (activeTool === 'ball') {
      BallCreator.createBall(fabricCanvas, pointer.x, pointer.y, selectedBallNumber);
    } else if (activeTool === 'straightLine') {
      if (!isDrawingLine) {
        setLineStartPoint({ x: pointer.x, y: pointer.y });
        setIsDrawingLine(true);
      } else {
        ShapeCreator.createLine(fabricCanvas, lineStartPoint!.x, lineStartPoint!.y, pointer.x, pointer.y);
        setIsDrawingLine(false);
        setLineStartPoint(null);
      }
    } else if (activeTool === 'circle') {
      ShapeCreator.createCircle(fabricCanvas, pointer.x, pointer.y);
    } else if (activeTool === 'rectangle') {
      ShapeCreator.createRectangle(fabricCanvas, pointer.x, pointer.y);
    } else if (activeTool === 'alignmentTool') {
      TrainingAidCreator.createAlignmentTool(fabricCanvas, pointer.x, pointer.y);
    } else if (activeTool === 'trainingAid') {
      TrainingAidCreator.createTrainingAid(fabricCanvas, pointer.x, pointer.y);
    }
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.on('mouse:down', handleCanvasClick);

    return () => {
      fabricCanvas.off('mouse:down', handleCanvasClick);
    };
  }, [fabricCanvas, activeTool, selectedBallNumber, isDrawingLine, lineStartPoint]);

  const handleSelectDrill = (drill: DrillData) => {
    if (!fabricCanvas) return;
    
    fabricCanvas.loadFromJSON(drill.canvasData, () => {
      fabricCanvas.renderAll();
    });
  };

  const handleProjectDrill = (drill: DrillData) => {
    setProjectionDrill(drill);
  };

  const handleNewDrill = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#8B0000';
    fabricCanvas.renderAll();
  };

  if (projectionDrill) {
    return (
      <DrillProjection 
        drill={projectionDrill}
        onExit={() => setProjectionDrill(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar
            selectedBallNumber={selectedBallNumber}
            onBallNumberChange={setSelectedBallNumber}
            onSelectDrill={handleSelectDrill}
            onProjectDrill={handleProjectDrill}
            onNewDrill={handleNewDrill}
          />
          
          <SidebarInset className="flex-1">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-lg">
              <div className="flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="h-8 w-8" />
                  <div className="h-6 w-px bg-border/50" />
                  <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Pool Training Studio
                  </h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <CanvasControls canvas={fabricCanvas} />
                  <ThemeToggle />
                  
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Floating Toolbar */}
            <FloatingToolbar
              activeTool={activeTool}
              onToolChange={setActiveTool}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onSave={() => setShowSaveDialog(true)}
              onProject={handleProjectCurrent}
              canUndo={canUndo}
              canRedo={canRedo}
            />

            {/* Main Canvas Area */}
            <main className="flex-1 p-6">
              <Card className="mx-auto max-w-fit bg-background/60 backdrop-blur-sm border-border/50 shadow-2xl">
                <div className="p-6">
                  <div className="relative">
                    <CanvasHandler 
                      onCanvasReady={setFabricCanvas}
                      canvasWidth={canvasWidth}
                      canvasHeight={canvasHeight}
                    />
                    
                    {/* Canvas overlay for line drawing feedback */}
                    {isDrawingLine && lineStartPoint && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
                          Click to finish line
                        </div>
                      </div>
                    )}

                    {/* Canvas usage hint */}
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                      Ctrl+Drag to pan • Mouse wheel to zoom
                    </div>
                  </div>
                </div>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <SaveDrillDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        canvas={fabricCanvas}
      />
    </div>
  );
};
