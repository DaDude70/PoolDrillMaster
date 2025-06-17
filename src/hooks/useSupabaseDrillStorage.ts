
import { useState, useEffect } from 'react';
import { DrillData } from '@/types/drill';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useSupabaseDrillStorage = () => {
  const [drills, setDrills] = useState<DrillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadDrills();
    } else {
      setDrills([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadDrills = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('drills')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedDrills = data.map(drill => ({
        id: drill.id,
        name: drill.name,
        description: drill.description || '',
        category: drill.category as DrillData['category'],
        canvasData: drill.canvas_data,
        thumbnail: drill.thumbnail,
        createdAt: new Date(drill.created_at),
        updatedAt: new Date(drill.updated_at)
      }));

      setDrills(formattedDrills);
    } catch (error) {
      console.error('Error loading drills:', error);
      toast.error('Failed to load drills');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDrill = async (drillData: Omit<DrillData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Please sign in to save drills');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('drills')
        .insert([{
          user_id: user.id,
          name: drillData.name,
          description: drillData.description,
          category: drillData.category,
          canvas_data: drillData.canvasData,
          thumbnail: drillData.thumbnail
        }])
        .select()
        .single();

      if (error) throw error;

      const newDrill: DrillData = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category as DrillData['category'],
        canvasData: data.canvas_data,
        thumbnail: data.thumbnail,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setDrills(prev => [newDrill, ...prev]);
      toast.success(`Drill "${newDrill.name}" saved successfully!`);
      return newDrill;
    } catch (error) {
      console.error('Error saving drill:', error);
      toast.error('Failed to save drill');
      return null;
    }
  };

  const updateDrill = async (id: string, updates: Partial<DrillData>) => {
    if (!user) {
      toast.error('Please sign in to update drills');
      return;
    }

    try {
      const { error } = await supabase
        .from('drills')
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          canvas_data: updates.canvasData,
          thumbnail: updates.thumbnail,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setDrills(prev => prev.map(drill => 
        drill.id === id 
          ? { ...drill, ...updates, updatedAt: new Date() }
          : drill
      ));
      toast.success('Drill updated successfully!');
    } catch (error) {
      console.error('Error updating drill:', error);
      toast.error('Failed to update drill');
    }
  };

  const deleteDrill = async (id: string) => {
    if (!user) {
      toast.error('Please sign in to delete drills');
      return;
    }

    try {
      const { error } = await supabase
        .from('drills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDrills(prev => prev.filter(drill => drill.id !== id));
      toast.success('Drill deleted successfully!');
    } catch (error) {
      console.error('Error deleting drill:', error);
      toast.error('Failed to delete drill');
    }
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
