
export interface DrillData {
  id: string;
  name: string;
  description: string;
  category: 'positioning' | 'breaking' | 'practice' | 'training' | 'other';
  canvasData: any; // Fabric.js canvas JSON data
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DrillCategory {
  id: string;
  name: string;
  description: string;
}
