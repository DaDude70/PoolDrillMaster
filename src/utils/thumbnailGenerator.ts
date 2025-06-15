
import { Canvas as FabricCanvas } from 'fabric';

export const generateThumbnail = (canvasData: any): Promise<string> => {
  return new Promise((resolve) => {
    // Create a temporary canvas for thumbnail generation
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 200;
    tempCanvas.height = 100;
    
    const fabricCanvas = new FabricCanvas(tempCanvas, {
      width: 200,
      height: 100,
      backgroundColor: '#8B0000'
    });

    fabricCanvas.loadFromJSON(canvasData, () => {
      // Scale down all objects to fit thumbnail
      const objects = fabricCanvas.getObjects();
      objects.forEach(obj => {
        obj.scaleX = (obj.scaleX || 1) * 0.2;
        obj.scaleY = (obj.scaleY || 1) * 0.2;
        obj.left = (obj.left || 0) * 0.2;
        obj.top = (obj.top || 0) * 0.2;
        obj.setCoords();
      });
      
      fabricCanvas.renderAll();
      
      // Convert to data URL with required multiplier property
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 1
      });
      
      fabricCanvas.dispose();
      resolve(dataURL);
    });
  });
};
