
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, FileText, Search, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  drillCount: number;
}

interface DrillWithUser {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string;
  user_email: string;
}

export const AdminPanel = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [allDrills, setAllDrills] = useState<DrillWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'drills'>('users');
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load users with drill counts
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, is_admin, created_at');

      if (usersError) throw usersError;

      // Get drill counts for each user
      const usersWithCounts = await Promise.all(
        usersData.map(async (user) => {
          const { count } = await supabase
            .from('drills')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          return {
            ...user,
            drillCount: count || 0
          };
        })
      );

      setUsers(usersWithCounts);

      // Load all drills with user info
      const { data: drillsData, error: drillsError } = await supabase
        .from('drills')
        .select(`
          id,
          name,
          description,
          category,
          created_at,
          profiles!inner(email)
        `)
        .order('created_at', { ascending: false });

      if (drillsError) throw drillsError;

      const formattedDrills = drillsData.map(drill => ({
        id: drill.id,
        name: drill.name,
        description: drill.description || '',
        category: drill.category,
        created_at: drill.created_at,
        user_email: (drill.profiles as any).email || 'Unknown'
      }));

      setAllDrills(formattedDrills);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const deleteDrill = async (drillId: string, drillName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${drillName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('drills')
        .delete()
        .eq('id', drillId);

      if (error) throw error;

      setAllDrills(prev => prev.filter(drill => drill.id !== drillId));
      toast.success('Drill deleted successfully');
    } catch (error) {
      console.error('Error deleting drill:', error);
      toast.error('Failed to delete drill');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrills = allDrills.filter(drill => 
    drill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drill.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <p>Loading admin panel...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Users ({users.length})
          </Button>
          <Button
            variant={activeTab === 'drills' ? 'default' : 'outline'}
            onClick={() => setActiveTab('drills')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            All Drills ({allDrills.length})
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {activeTab === 'users' && (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.email}</h4>
                      {user.is_admin && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {user.drillCount} drill{user.drillCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'drills' && (
          <div className="space-y-3">
            {filteredDrills.map((drill) => (
              <div key={drill.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{drill.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{drill.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {drill.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        by {drill.user_email}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(drill.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteDrill(drill.id, drill.name)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
