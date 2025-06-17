
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Canvas as FabricCanvas } from 'fabric';
import { useSupabaseDrillStorage } from '@/hooks/useSupabaseDrillStorage';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { toast } from 'sonner';

interface SaveDrillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  canvas: FabricCanvas | null;
}

export const SaveDrillDialog = ({ isOpen, onClose, canvas }: SaveDrillDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('practice');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { saveDrill } = useSupabaseDrillStorage();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!canvas || !name.trim()) {
      toast.error('Please enter a drill name');
      return;
    }

    const canvasData = canvas.toJSON();
    const result = await saveDrill({
      name: name.trim(),
      description: description.trim(),
      category: category as any,
      canvasData
    });

    if (result) {
      setName('');
      setDescription('');
      setCategory('practice');
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setCategory('practice');
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Save Drill
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter drill name..."
                className="mt-1 bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the drill..."
                className="mt-1 bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positioning">Positioning</SelectItem>
                  <SelectItem value="breaking">Breaking</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              {user ? 'Save Drill' : 'Sign In to Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  );
};
