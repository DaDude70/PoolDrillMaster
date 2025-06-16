
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DrillData } from '@/types/drill';
import { useDrillStorage } from '@/hooks/useDrillStorage';
import { Play, Trash2, Search, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DrillLibraryProps {
  onSelectDrill: (drill: DrillData) => void;
  onProjectDrill: (drill: DrillData) => void;
  onNewDrill: () => void;
}

export const DrillLibrary = ({ onSelectDrill, onProjectDrill, onNewDrill }: DrillLibraryProps) => {
  const { drills, isLoading, deleteDrill } = useDrillStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'positioning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'breaking': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'practice': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'training': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="text-center py-8 text-muted-foreground">Loading drills...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Drill Library</h3>
          <Button onClick={onNewDrill} size="sm" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search drills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-8 bg-background/50"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 bg-background/50">
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
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredDrills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {drills.length === 0 ? (
                <div>
                  <p className="text-sm">No drills saved yet.</p>
                  <p className="text-xs mt-1 opacity-75">Create your first drill to get started!</p>
                </div>
              ) : (
                <p className="text-sm">No drills match your search criteria.</p>
              )}
            </div>
          ) : (
            filteredDrills.map((drill) => (
              <Card
                key={drill.id}
                className="p-3 hover:bg-accent/50 cursor-pointer transition-all duration-200 border-border/50 bg-background/30 backdrop-blur-sm"
                onClick={() => onSelectDrill(drill)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{drill.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{drill.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs px-2 py-0 ${getCategoryColor(drill.category)}`}>
                        {drill.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {drill.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleProject(drill, e)}
                      className="h-7 w-7 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleDelete(drill, e)}
                      className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
