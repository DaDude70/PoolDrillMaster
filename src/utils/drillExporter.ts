
import { DrillData } from '@/types/drill';
import { toast } from 'sonner';

export const exportDrills = (drills: DrillData[]) => {
  const dataStr = JSON.stringify(drills, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `billiard-drills-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast.success('Drills exported successfully!');
};

export const importDrills = (file: File): Promise<DrillData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const drills = JSON.parse(content);
        
        // Validate and transform the data
        const validDrills = drills.map((drill: any) => ({
          ...drill,
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(drill.createdAt || Date.now()),
          updatedAt: new Date(drill.updatedAt || Date.now())
        }));
        
        resolve(validDrills);
        toast.success(`Imported ${validDrills.length} drills successfully!`);
      } catch (error) {
        reject(new Error('Invalid file format'));
        toast.error('Failed to import drills. Please check the file format.');
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
      toast.error('Failed to read the file.');
    };
    
    reader.readAsText(file);
  });
};
