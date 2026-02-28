import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const useCustomSubjects = () => {
  const { user, updateUser } = useAuthStore();
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadCustomSubjects();
    }
  }, [user?.id]);

  const loadCustomSubjects = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('custom_subjects')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const subjects = (data?.custom_subjects as string[]) || [];
      setCustomSubjects(subjects);
      
      // Update auth store
      if (user) {
        updateUser({ ...user, customSubjects: subjects });
      }
    } catch (error: any) {
      console.error('Error loading custom subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomSubject = async (subject: string) => {
    if (!user?.id) return;

    const trimmed = subject.trim();
    if (!trimmed) return;

    // Check if already exists (case-insensitive)
    if (customSubjects.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('This subject already exists');
      return;
    }

    try {
      const newSubjects = [...customSubjects, trimmed];

      const { error } = await supabase
        .from('user_profiles')
        .update({ custom_subjects: newSubjects })
        .eq('id', user.id);

      if (error) throw error;

      setCustomSubjects(newSubjects);
      
      // Update auth store
      if (user) {
        updateUser({ ...user, customSubjects: newSubjects });
      }
      
      toast.success(`Added "${trimmed}" to your subjects`);
    } catch (error: any) {
      console.error('Error adding custom subject:', error);
      toast.error('Failed to add subject');
    }
  };

  const removeCustomSubject = async (subject: string) => {
    if (!user?.id) return;

    try {
      const newSubjects = customSubjects.filter((s) => s !== subject);

      const { error } = await supabase
        .from('user_profiles')
        .update({ custom_subjects: newSubjects })
        .eq('id', user.id);

      if (error) throw error;

      setCustomSubjects(newSubjects);
      
      // Update auth store
      if (user) {
        updateUser({ ...user, customSubjects: newSubjects });
      }
      
      toast.success(`Removed "${subject}" from your subjects`);
    } catch (error: any) {
      console.error('Error removing custom subject:', error);
      toast.error('Failed to remove subject');
    }
  };

  return {
    customSubjects,
    loading,
    addCustomSubject,
    removeCustomSubject,
    reload: loadCustomSubjects,
  };
};
