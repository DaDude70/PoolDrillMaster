
import { useState, useEffect } from 'react';
import { DrillData } from '@/types/drill';
import { toast } from 'sonner';

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

  const saveDrill = (drillData: Omit<DrillData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDrill: DrillData = {
      ...drillData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedDrills = [...drills, newDrill];
    setDrills(updatedDrills);
    localStorage.setItem('billiard-drills', JSON.stringify(updatedDrills));
    toast.success(`Drill "${newDrill.name}" saved successfully!`);
    return newDrill;
  };

  const updateDrill = (id: string, updates: Partial<DrillData>) => {
    const updatedDrills = drills.map(drill => 
      drill.id === id 
        ? { ...drill, ...updates, updatedAt: new Date() }
        : drill
    );
    setDrills(updatedDrills);
    localStorage.setItem('billiard-drills', JSON.stringify(updatedDrills));
    toast.success('Drill updated successfully!');
  };

  const deleteDrill = (id: string) => {
    const updatedDrills = drills.filter(drill => drill.id !== id);
    setDrills(updatedDrills);
    localStorage.setItem('billiard-drills', JSON.stringify(updatedDrills));
    toast.success('Drill deleted successfully!');
  };

  const getDrillById = (id: string) => drills.find(drill => drill.id === id);

  return {
    drills,
    isLoading,
    saveDrill,
    updateDrill,
    deleteDrill,
    getDrillById,
    refreshDrills: loadDrills
  };
};
