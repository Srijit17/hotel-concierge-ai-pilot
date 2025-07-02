
import { supabase } from '@/integrations/supabase/client';

export class SessionManager {
  static async initializeSession(): Promise<string> {
    try {
      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          channel: 'web_widget',
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return session.id;
    } catch (error) {
      console.error('Error initializing session:', error);
      return '';
    }
  }

  static updateTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }
}
