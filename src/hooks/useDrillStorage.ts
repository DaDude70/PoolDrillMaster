
import { useState, useEffect } from 'react';
import { DrillData } from '@/types/drill';
import { toast } from 'sonner';
import { generateThumbnail } from '@/utils/thumbnailGenerator';
import { exportDrills, importDrills } from '@/utils/drillExporter';

export const useDrillStorage = () => {
  const [drills, setDrills] = useState<DrillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrills();
  }, []);

  const loadDrills = () => {
    try {
      const savedDrills = localStorage.getItem('billiard-drills');
      if (savedDrills) {
        const parsedDrills = JSON.parse(savedDrills).map((drill: any) => ({
          ...drill,
          createdAt: new Date(drill.createdAt),
          updatedAt: new Date(drill.updatedAt)
        }));
        setDrills(parsedDrills);
      }
    } catch (error) {
      console.error('Error loading drills:', error);
      toast.error('Failed to load saved drills');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDrill = async (drillData: Omit<DrillData, 'id' | 'createdAt' | 'updatedAt' | 'thumbnail'>) => {
    try {
      const thumbnail = await generateThumbnail(drillData.canvasData);
      
      const newDrill: DrillData = {
        ...drillData,
        id: Date.now().toString(),
        thumbnail,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedDrills = [...drills, newDrill];
      setDrills(updatedDrills);
      localStorage.setItem('billiard-drills', JSON.stringify(updatedDrills));
      toast.success(`Drill "${newDrill.name}" saved successfully!`);
      return newDrill;
    } catch (error) {
      console.error('Error saving drill:', error);
      toast.error('Failed to save drill');
      throw error;
    }
  };

  const updateDrill = async (id: string, updates: Partial<DrillData>) => {
    try {
      let thumbnail = undefined;
      if (updates.canvasData) {
        thumbnail = await generateThumbnail(updates.canvasData);
      }

      const updatedDrills = drills.map(drill => 
        drill.id === id 
          ? { ...drill, ...updates, thumbnail: thumbnail || drill.thumbnail, updatedAt: new Date() }
          : drill
      );
      setDrills(updatedDrills);
      localStorage.setItem('billiard-drills', JSON.stringify(updatedDrills));
      toast.success('Drill updated successfully!');
    } catch (error) {
      console.error('Error updating drill:', error);
      toast.error('Failed to update drill');
    }
  };

  const deleteDrill = (id: string) => {
    const updatedDrills = drills.filter(drill => drill.id !== id);
    setDrills(updatedDrills);
    localStorage.setItem('billiard-drills', JSON.stringify(updatedDrills));
    toast.success('Drill deleted successfully!');
  };

  const getDrillById = (id: string) => drills.find(drill => drill.id === id);

  const exportAllDrills = () => {
    exportDrills(drills);
  };

  const importDrillsFromFile = async (file: File) => {
    try {
      const importedDrills = await importDrills(file);
      const updatedDrills = [...drills, ...importedDrills];
      setDrills(updatedDrills);
      localStorage.setItem('billiard-drills', JSON.stringify(updatedDrills));
    } catch (error) {
      console.error('Error importing drills:', error);
      throw error;
    }
  };

  return {
    drills,
    isLoading,
    saveDrill,
    updateDrill,
    deleteDrill,
    getDrillById,
    refreshDrills: loadDrills,
    exportAllDrills,
    importDrillsFromFile
  };
};
