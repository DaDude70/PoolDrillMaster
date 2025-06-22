
import { Circle, Rect, Line, Polygon, Group } from 'fabric';
import { Canvas as FabricCanvas } from 'fabric';

export class ShapeCreator {
  static createLine(canvas: FabricCanvas, startX: number, startY: number, endX: number, endY: number) {
    const line = new Line([startX, startY, endX, endY], {
      stroke: '#FFFF00',
      strokeWidth: 3,
      selectable: true,
    });
    canvas.add(line);
  }

  static createArrowLine(canvas: FabricCanvas, startX: number, startY: number, endX: number, endY: number) {
    // Create the main line
    const line = new Line([startX, startY, endX, endY], {
      stroke: '#FF4500',
      strokeWidth: 4,
      selectable: true,
    });
    
    // Calculate arrow head
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowLength = 20;
    const arrowAngle = Math.PI / 6; // 30 degrees
    
    // Arrow head points
    const arrowX1 = endX - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = endY - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = endX - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = endY - arrowLength * Math.sin(angle + arrowAngle);
    
    // Create arrow head as a triangle
    const arrowHead = new Polygon([
      { x: endX, y: endY },
      { x: arrowX1, y: arrowY1 },
      { x: arrowX2, y: arrowY2 }
    ], {
      fill: '#FF4500',
      stroke: '#FF4500',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    
    // Group line and arrow head together
    const arrowLine = new Group([line, arrowHead], {
      left: Math.min(startX, endX),
      top: Math.min(startY, endY),
    });
    
    canvas.add(arrowLine);
  }

  static createCircle(canvas: FabricCanvas, x: number, y: number) {
    const circle = new Circle({
      left: x - 25,
      top: y - 25,
      radius: 25,
      fill: '#00FFFF',
      stroke: '#00FFFF',
      strokeWidth: 3,
      selectable: true,
    });
    canvas.add(circle);
  }

  static createRectangle(canvas: FabricCanvas, x: number, y: number) {
    const rect = new Rect({
      left: x - 40,
      top: y - 30,
      width: 80,
      height: 60,
      fill: '#00FFFF',
      stroke: '#00FFFF',
      strokeWidth: 3,
      selectable: true,
    });
    canvas.add(rect);
  }
}
