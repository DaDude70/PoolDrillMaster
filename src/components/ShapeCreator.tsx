
import { Circle, Rect, Line } from 'fabric';
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
