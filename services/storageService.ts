import { supabase } from './supabaseClient';
import { TestRecord } from '../types.ts';

export const storageService = {
  // Recupera i test dal Cloud
  async getAllTests(): Promise<TestRecord[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('uploadedAt', { ascending: false });

    if (error) {
      console.error("Errore download:", error);
      return [];
    }
    return data as TestRecord[];
  },

  // Salva il test nel Cloud
  async saveTest(test: TestRecord): Promise<void> {
    const { error } = await supabase
      .from('tests')
      .upsert(test);

    if (error) {
      console.error("Errore salvataggio:", error);
      throw error;
    }
  },

  // Elimina il test dal Cloud
  async deleteTest(id: string): Promise<void> {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
