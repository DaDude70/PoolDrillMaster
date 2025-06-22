
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DrillData } from '@/types/drill';
import { useDrillStorage } from '@/hooks/useDrillStorage';
import { useAuth } from '@/hooks/useAuth';
import { Play, Edit, Trash2, Plus, Search, Settings } from 'lucide-react';
import { AdminPanel } from './AdminPanel';
import { toast } from 'sonner';

interface DrillManagerProps {
  onSelectDrill: (drill: DrillData) => void;
  onProjectDrill: (drill: DrillData) => void;
  onNewDrill: () => void;
}

export const DrillManager = ({ onSelectDrill, onProjectDrill, onNewDrill }: DrillManagerProps) => {
  const { drills, isLoading, deleteDrill } = useDrillStorage();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  if (showAdminPanel) {
    return (
      <div className="space-y-4">
        <Button
          onClick={() => setShowAdminPanel(false)}
          variant="outline"
          size="sm"
        >
          ← Back to Drills
        </Button>
        <AdminPanel />
      </div>
    );
  }

  const filteredDrills = drills.filter(drill => {
    const matchesSearch = drill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || drill.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (drill: DrillData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${drill.name}"?`)) {
      deleteDrill(drill.id);
    }
  };

  const handleProject = (drill: DrillData, e: React.MouseEvent) => {
    e.stopPropagation();
    onProjectDrill(drill);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">Loading drills...</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Drill Library</h3>
          <div className="flex gap-2">
            {isAdmin && (
              <Button
                onClick={() => setShowAdminPanel(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            )}
            <Button onClick={onNewDrill} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Drill
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search drills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="positioning">Positioning</SelectItem>
              <SelectItem value="breaking">Breaking</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredDrills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {drills.length === 0 ? (
                <>
                  <p>No drills saved yet.</p>
                  <p className="text-sm mt-2">Create your first drill to get started!</p>
                </>
              ) : (
                <p>No drills match your search criteria.</p>
              )}
            </div>
          ) : (
            filteredDrills.map((drill) => (
              <div
                key={drill.id}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectDrill(drill)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{drill.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{drill.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {drill.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {drill.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleProject(drill, e)}
                      className="h-8 w-8 p-0"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleDelete(drill, e)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
